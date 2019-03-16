const { getArgs } = require('../utils/args');

const FAAS_CLI_LIST_FLAGS = [
  '--gateway',
  '--tls-noverify',
];

/**
 * DeployListFunctions plugin - `sls deploy list functions`
 * @class
 */
class OpenFaasDeployListFunctions {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      deploy: {
        commands: {
          list: {
            commands: {
              functions: {
                usage: 'Lists OpenFaaS functions',
                lifecycleEvents: [
                  'list',
                ],
              },
            },
          },
        },
      },
    };

    this.hooks = {
      'deploy:list:functions:list': this.listFunctions.bind(this),
    };
  }

  /**
   * Lists OpenFaaS functions
   *
   * @returns {Promise}
   */
  listFunctions() {
    return this.provider.cli.list(
      ...getArgs(
        this.serverless.service.provider,
        this.options,
        FAAS_CLI_LIST_FLAGS,
      ),
    ).promise;
  }
}

module.exports = OpenFaasDeployListFunctions;
