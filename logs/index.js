/**
 * Logs plugin - `sls logs`
 * @class
 */
class OpenFaasLogs {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.hooks = {
      'logs:logs': this.logs.bind(this),
    };
  }

  logs() {
    this.serverless.cli.log('This command is not supported yet. Please use your'
      + ' container orchestration cli (docker, kubectl, etc).');
  }
}

module.exports = OpenFaasLogs;
