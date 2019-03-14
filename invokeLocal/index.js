const { spawn, spawnSync } = require('child_process');
const http = require('http');

/**
 * InvokeLocal plugin - `sls invoke local`
 * @class
 */
class OpenFaasInvokeLocal {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      invoke: {
        commands: {
          local: {
            usage: 'Invoke function locally',
            lifecycleEvents: [
              'invoke:local:invoke',
            ],
            options: {
              network: {
                usage: 'Docker network to attach to',
                shortcut: 'n',
              },
            },
          },
        },
      },
    };

    this.hooks = {
      'invoke:local:invoke': this.invokeLocal.bind(this),
    };
  }

  /**
   * @typedef Spawn
   * @property {Object} process - NodeJS ChildProcess
   * @property {Promise} promise
   */

  /**
   * Spawns an OpenFaaS function docker container
   *
   * @param {Object} params
   * @param {number} params.port - host port
   * @param {string} params.image - docker image
   * @param {Array<string>} params.args - additional `docker run` arguments
   * @returns {Spawn}
   */
  static spawnFunction({ port, image, args = [] }) {
    let docker;
    const promise = new Promise((resolve, reject) => {
      docker = spawn(
        'docker',
        ['run', '--rm', '-p', `${port}:8080`, ...args, image],
        { stdio: 'pipe' },
      );

      docker.stdout.on('data', (data) => {
        process.stdout.write(`\x1b[34mdocker --> ${data.toString('utf8')}\x1b[0m`);
      });

      docker.stderr.on('data', (data) => {
        process.stderr.write(`\x1b[34mdocker --> ${data.toString('utf8')}\x1b[0m`);
      });

      docker.on('close', resolve);
      docker.on('error', reject);
    });

    return {
      process: docker,
      promise,
    };
  }

  /**
   * Spawns an http request to the OpenFaaS function
   *
   * @param {Object} params
   * @param {string} params.hostname
   * @param {number} params.port
   * @returns {Promise}
   */
  static spawnRequest({ hostname, port }) {
    return new Promise((resolve, reject) => {
      http.get(`http://${hostname}:${port}`, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (data) => { rawData += data; });
        res.on('end', () => {
          const status = `HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`;
          const headers = Object.entries(res.headers).map(([k, v]) => `${k} ${v}`).join('\n');
          const message = `\n${status}\n${headers}\n\n${rawData}`;
          process.stdout.write(`\x1b[35mhttp --> ${message}\n\x1b[0m`);
          resolve();
        });
      }).on('error', reject);
    });
  }

  /**
   * Get an array of arguments to pass to the spawned process
   * Ref: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
   *
   * @param {Object} slsOptions - serverless options, passed from command line
   * @param {Object} funcConfig - function config object as defined in serverless.yml
   * @returns {Array<string>} nodejs child_process.spawn args array
   */
  static getArgs(slsOptions, funcConfig) {
    // Convert command-line --env to object of key/value pairs
    const invokeEnv = [].concat(slsOptions.env || [])
      .map(envar => envar.split('='))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    // Get env vars from function config
    const funcEnv = funcConfig.environment || {};

    // Merge envs, with command-line taking precendence
    const env = { ...funcEnv, ...invokeEnv };

    // Convert env object to array of args to pass to the spawned process
    const args = Object.entries(env)
      .map(([k, v]) => ['--env', `${k}=${v}`])
      .reduce((acc, arg) => acc.concat(arg), []);

    if (slsOptions.network) {
      args.push('--network');
      args.push(slsOptions.network);
    }

    return args;
  }

  /**
   * Invokes a serverless function locally, without OpenFaaS (uses docker)
   *
   * @returns {Promise}
   */
  invokeLocal() {
    return new Promise((resolve, reject) => {
      const port = Math.floor(Math.random() * (49151 - 5001) + 5001);
      let request;

      const funcConfig = this.serverless.service.getFunction(this.options.function);
      const args = this.constructor.getArgs(this.options, funcConfig);

      this.serverless.cli.log(`Starting docker image ${funcConfig.image} on host port ${port}`);
      const service = this.constructor.spawnFunction({ port, image: funcConfig.image, args });

      // Handles stopping running processes and exits cleanly
      const exit = (err) => {
        if (service && service.process && !service.process.killed) {
          service.process.kill();
        }

        const promises = [];
        if (service && service.promise) { promises.push(service.promise); }
        if (request) { promises.push(request); }

        return Promise.all(promises)
          .then(() => { if (err) { reject(err); } else { resolve(); } })
          .catch(reject);
      };

      let pollInterval;
      let timeout = 5;
      const pollService = () => {
        this.serverless.cli.log(timeout);
        const curl = spawnSync(
          'curl',
          ['-s', '-o', '/dev/null', '-w', '%{http_code}', `http://127.0.0.1:${port}/_/health`],
          { stdio: 'pipe' },
        );
        if (curl.status === 0 && curl.stdout && curl.stdout.toString('utf8') === '200') {
          clearInterval(pollInterval);
          this.constructor.spawnRequest({ hostname: '127.0.0.1', port }).then(exit).catch(exit);
        }

        timeout -= 1;
        if (timeout === 0) {
          clearInterval(pollInterval);
          exit('Timed out waiting for service');
        }
      };

      // Poll the host port until the service is running
      this.serverless.cli.log(`Waiting for the service to be available (timeout=${timeout})...`);
      pollInterval = setInterval(pollService, 1000);
    });
  }
}

module.exports = OpenFaasInvokeLocal;
