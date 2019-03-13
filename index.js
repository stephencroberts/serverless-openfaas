const OpenFaasProvider = require('./provider');
/**
 * Super plugin for OpenFaas -- loads all of the other plugins
 * @class
 */
class OpenFaasIndex {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.serverless.pluginManager.addPlugin(OpenFaasProvider);
  }
}

module.exports = OpenFaasIndex;
