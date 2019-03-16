const { getArgs } = require('../utils/args');

const FAAS_CLI_LIST_FLAGS = [
  '--gateway',
  '--tls-noverify',
];

/**
 * Deploy plugin - `sls deploy list`
 * @class
 */
class OpenFaasDeployList {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      deploy: {
        commands: {
          list: {
            usage: 'Lists OpenFaaS functions',
            lifecycleEvents: [
              'list',
            ],
          },
        },
      },
    };

    this.hooks = {
      'deploy:list:list': this.list.bind(this),
    };
  }

  /**
   * Deploys a Serverless service to OpenFaaS
   *
   * @returns {Promise}
   */
  list() {
    return this.provider.cli.list(
      ...getArgs(
        this.serverless.service.provider,
        this.options,
        FAAS_CLI_LIST_FLAGS,
      ),
    );
  }
}

module.exports = OpenFaasDeployList;
