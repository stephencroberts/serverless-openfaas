const { getArgs } = require('../utils/args');

const FAAS_CLI_DEPLOY_FLAGS = [
  '--annotation',
  '--constraint',
  '--env',
  '--fprocess',
  '--gateway',
  '--handler',
  '--image',
  '--label',
  '--lang',
  '--name',
  '--network',
  '--readonly',
  '--replace',
  '--secret',
  '--send-registry-auth',
  '--tag',
  '--tls-no-verify',
  '--update',
];

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

    return Promise.all(functions
      .map(funcName => this.provider.cli.deploy(
        ...getArgs(
          this.serverless.service.provider,
          this.serverless.service.getFunction(funcName),
          this.options,
          FAAS_CLI_DEPLOY_FLAGS,
        ),
      )));
  }
}

module.exports = OpenFaasDeploy;
