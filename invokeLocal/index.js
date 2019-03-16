const { spawnSync } = require('child_process');
const spawn = require('../utils/spawn');
const Logger = require('../utils/logger');
const { getArgs } = require('../utils/args');

const DOCKER_RUN_FLAGS = [
  '--env',
  '--network',
];

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
            usage: 'Invokes an OpenFaaS function container locally',
            options: {
              network: {
                usage: 'Docker network to attach the function container to',
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
   * Waits for the spawned function to be ready
   *
   * @param {string} network - docker network
   * @returns {Promise} resolves when the function is ready or rejects if it
   * timed out
   */
  static waitForFunction(network) {
    return new Promise((resolve, reject) => {
      const logger = new Logger('wait', 32);
      let pollInterval;
      let timeout = 5;
      const pollFunction = () => {
        logger.log(`${timeout}\n`);
        const curl = OpenFaasInvokeLocal.spawnHealthCheckSync(network);
        if (curl.status === 0 && curl.stdout && curl.stdout.toString('utf8') === '200') {
          clearInterval(pollInterval);
          resolve();
        }

        timeout -= 1;
        if (timeout === 0) {
          clearInterval(pollInterval);
          reject(new Error('Timed out waiting for function'));
        }
      };

      // Poll until the function is running
      logger.log(`Waiting for the function to be available (timeout=${timeout})...\n`);
      pollInterval = setInterval(pollFunction, 1000);
    });
  }

  /**
   * Spawns an OpenFaaS function docker image
   *
   * @param {string} image - docker image
   * @param {string[]} args - args to pass to the docker run command
   * @returns {Spawn}
   */
  static spawnFunction(image, args) {
    const docker = spawn(
      'docker',
      ['run', '--rm', '--name', 'faas-fn', ...args, image],
      { logger: new Logger('docker', 34) },
    );

    const network = args[args.findIndex(arg => arg === '--network') + 1];
    return OpenFaasInvokeLocal.waitForFunction(network)
      .then(() => docker)
      .catch((err) => {
        docker.process.kill();
        return docker.promise.then(() => { throw err; });
      });
  }

  /**
   * Spawns a health check process (curl in a docker container) synchronously
   *
   * @param {string} network - docker network
   * @returns {Object} NodeJS child_process.spawnSync return value
   */
  static spawnHealthCheckSync(network) {
    return spawnSync(
      'docker',
      [
        'run',
        '--rm',
        '--network', network,
        'byrnedo/alpine-curl',
        '-s',
        '-o', '/dev/null',
        '-w', '%{http_code}',
        'http://faas-fn:8080/_/health',
      ],
      { stdio: 'pipe' },
    );
  }

  /**
   * Spawns an http request process (curl in a docker container) synchronously
   *
   * @param {string} network - docker network
   * @returns {Object} NodeJS child_process.spawnSync return value
   */
  static spawnHttpRequestSync(network) {
    return spawnSync(
      'docker',
      [
        'run',
        '--rm',
        '--network', network,
        'byrnedo/alpine-curl',
        '-sS',
        '-D', '-',
        'http://faas-fn:8080',
      ],
      { stdio: 'pipe' },
    );
  }

  /**
   * Invokes a serverless function locally, without OpenFaaS (uses docker)
   *
   * @returns {Promise}
   */
  invokeLocal() {
    return new Promise((resolve, reject) => {
      const fnConfig = this.serverless.service.getFunction(this.options.function);
      const args = getArgs(fnConfig, this.options, DOCKER_RUN_FLAGS);

      this.serverless.cli.log(`Starting docker image ${fnConfig.image}`);
      OpenFaasInvokeLocal.spawnFunction(fnConfig.image, args)
        .then((func) => {
          const curlLogger = new Logger('curl', 35);
          const curl = OpenFaasInvokeLocal.spawnHttpRequestSync(this.options.network);
          if (curl.status === 0 && curl.stdout) {
            curlLogger.log(curl.stdout);
          } else if (curl.stderr) {
            curlLogger.err(curl.stderr);
          }
          func.process.kill();
          func.promise.then(resolve).catch(reject);
        });
    });
  }
}

module.exports = OpenFaasInvokeLocal;
