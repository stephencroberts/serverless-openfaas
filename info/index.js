/**
 * Info plugin - `sls info`
 * @class
 */
class OpenFaasInfo {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.hooks = {
      'info:info': this.info.bind(this),
    };
  }

  /**
   * Displays information about the service
   *
   * @returns {Promise}
   */
  info() {
    return new Promise((resolve) => {
      const message = '\x1b[0;33m\x1b[04mService Information\x1b[0m\n'
        + `\x1b[0;33mservice:\x1b[0m ${this.serverless.service.service}\x1b[0m\n`
        + '\n';

      this.serverless.cli.consoleLog(message);

      resolve();
    });
  }
}

module.exports = OpenFaasInfo;
