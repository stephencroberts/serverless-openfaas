/**
 * Deploy plugin - `sls deploy`
 * @class
 */
class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      deploy: {
        usage: 'Deploy OpenFaaS function containers',
        options: {
          env: {
            usage: 'Environment variable (key=value)',
          },
          function: {
            usage: 'Function name -- deploys a single function container (see \'deploy function\')',
            shortcut: 'f',
          },
          gateway: {
            usage: 'OpenFaaS gateway',
          },
          conceal: { usage: 'Not used' },
          stage: { usage: 'Not used' },
          region: { usage: 'Not used' },
          package: { usage: 'Not used' },
          verbose: { usage: 'Not used' },
          force: { usage: 'Not used' },
          'aws-s3-accelerate': { usage: 'Not used' },
        },
      },
    };

    this.hooks = {
      'deploy:deploy': this.deploy.bind(this),
    };
  }

  /**
   * Deploys a Serverless service to OpenFaaS
   *
   * @returns {Promise}
   */
  deploy() {
    const functions = this.options.function
      ? [].concat(this.options.function || [])
      : this.serverless.service.getAllFunctions();

    return functions.reduce((promiseChain, funcName) => promiseChain.then(() => {
      this.options.function = funcName;
      return this.serverless.pluginManager.spawn('deploy:function');
    }),
    Promise.resolve());
  }
}

module.exports = OpenFaasDeploy;
