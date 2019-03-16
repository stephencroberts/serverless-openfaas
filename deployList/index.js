/**
 * DeployList plugin - `sls deploy list`
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
   * Lists OpenFaaS functions
   *
   * @returns {Promise}
   */
  list() {
    return this.serverless.pluginManager.spawn('deploy:list:functions');
  }
}

module.exports = OpenFaasDeployList;
