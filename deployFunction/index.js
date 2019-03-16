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
 * DeployFunction plugin - `sls deploy function`
 * @class
 */
class OpenFaasDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      deploy: {
        commands: {
          function: {
            usage: 'Deploys an OpenFaaS function container',
            options: {
              env: {
                usage: 'Environment variable (key=value)',
              },
              function: {
                usage: 'Function name -- deploys a single function container',
                required: true,
                shortcut: 'f',
              },
              gateway: {
                usage: 'OpenFaaS gateway',
              },
              stage: { usage: 'Not used' },
              region: { usage: 'Not used' },
              force: { usage: 'Not used' },
              'update-config': { usage: 'Not used' },
            },
          },
        },
      },
    };

    this.hooks = {
      'deploy:function:deploy': this.deployFunction.bind(this),
    };
  }

  /**
   * Deploys an OpenFaaS function container
   *
   * @returns {Promise}
   */
  deployFunction() {
    return this.provider.cli.deploy(
      ...getArgs(
        this.serverless.service.provider,
        this.serverless.service.getFunction(this.options.function),
        this.options,
        FAAS_CLI_DEPLOY_FLAGS,
      ),
    ).promise;
  }
}

module.exports = OpenFaasDeploy;
