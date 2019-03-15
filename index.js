const OpenFaasProvider = require('./provider');
const OpenFaasPackage = require('./package/index');
const OpenFaasInvokeLocal = require('./invokeLocal');
const OpenFaasDeploy = require('./deploy');

/**
 * Super plugin for OpenFaas -- loads all of the other plugins
 * @class
 */
class OpenFaasIndex {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.serverless.pluginManager.addPlugin(OpenFaasProvider);
    this.serverless.pluginManager.addPlugin(OpenFaasPackage);
    this.serverless.pluginManager.addPlugin(OpenFaasInvokeLocal);
    this.serverless.pluginManager.addPlugin(OpenFaasDeploy);
  }
}

module.exports = OpenFaasIndex;
