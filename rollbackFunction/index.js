/**
 * RollbackFunction plugin - `sls rollback function`
 * @class
 */
class OpenFaasRollbackFunction {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.hooks = {
      'rollback:function:rollback': this.rollbackFunction.bind(this),
    };
  }

  /**
   * Rollback the function to the previous version
   *
   * @returns {Promise}
   */
  rollbackFunction() {
    return this.serverless.pluginManager.spawn('deploy:function');
  }
}

module.exports = OpenFaasRollbackFunction;
