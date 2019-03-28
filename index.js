const OpenFaasProvider = require('./provider');
const OpenFaasPackage = require('./package/index');
const OpenFaasInvoke = require('./invoke');
const OpenFaasInvokeLocal = require('./invokeLocal');
const OpenFaasDeploy = require('./deploy');
const OpenFaasDeployFunction = require('./deployFunction');
const OpenFaasDeployList = require('./deployList');
const OpenFaasDeployListFunctions = require('./deployListFunctions');
const OpenFaasInfo = require('./info');
const OpenFaasLogs = require('./logs');
const OpenFaasRollback = require('./rollback');
const OpenFaasRollbackFunction = require('./rollbackFunction');

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
    this.serverless.pluginManager.addPlugin(OpenFaasDeployFunction);
    this.serverless.pluginManager.addPlugin(OpenFaasDeployList);
    this.serverless.pluginManager.addPlugin(OpenFaasDeployListFunctions);
    this.serverless.pluginManager.addPlugin(OpenFaasInfo);
    this.serverless.pluginManager.addPlugin(OpenFaasLogs);
    this.serverless.pluginManager.addPlugin(OpenFaasRollback);
    this.serverless.pluginManager.addPlugin(OpenFaasRollbackFunction);
  }
}

module.exports = OpenFaasIndex;
