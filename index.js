const OpenFaasProvider = require('./provider');
const OpenFaasPackage = require('./package/index');
const OpenFaasInvoke = require('./invoke');
const OpenFaasInvokeLocal = require('./invokeLocal');
const OpenFaasDeploy = require('./deploy');
const OpenFaasDeployList = require('./deployList');

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
    this.serverless.pluginManager.addPlugin(OpenFaasInvoke);
    this.serverless.pluginManager.addPlugin(OpenFaasInvokeLocal);
    this.serverless.pluginManager.addPlugin(OpenFaasDeploy);
    this.serverless.pluginManager.addPlugin(OpenFaasDeployList);
  }
}

module.exports = OpenFaasIndex;
