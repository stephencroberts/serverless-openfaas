/**
 * Rollback plugin - `sls rollback`
 * @class
 */
class OpenFaasRollback {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.hooks = {
      'rollback:rollback': this.rollback.bind(this),
    };
  }

  /**
   * Rollback the Serverless service to a specific deployment
   *
   * @returns {Promise}
   */
  rollback() {
    return this.serverless.pluginManager.spawn('deploy');
  }
}

module.exports = OpenFaasRollback;
