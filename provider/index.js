const FaasCli = require('./lib/faascli');

/**
 * Serverless Framework provider for OpenFaaS
 * @class
 */
class OpenFaasProvider {
  /**
   * Gets the provider name
   *
   * @returns {string} provider name
   */
  static getProviderName() {
    return 'openfaas';
  }

  /**
   * Creates a new OpenFaasProvider instance
   *
   * @param {Object} serverless
   */
  constructor(serverless) {
    this.serverless = serverless;
    this.provider = this;
    this.serverless.setProvider('openfaas', this);
    this.cli = new FaasCli();
  }
}

module.exports = OpenFaasProvider;
