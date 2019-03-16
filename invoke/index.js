const { getArgs } = require('../utils/args');

const FAAS_CLI_INVOKE_FLAGS = [
  '--async',
  '--content-type',
  '--gateway',
  '--header',
  '--key',
  '--method',
  '--name',
  '--query',
  '-sign',
  '--tls-no-verify',
];

/**
 * Invoke plugin - `sls invoke`
 * @class
 */
class OpenFaasInvoke {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      invoke: {
        usage: 'Invokes an OpenFaaS function container',
        lifecycleEvents: [
          'invoke',
        ],
      },
    };

    this.hooks = {
      'invoke:invoke': this.invoke.bind(this),
    };
  }

  /**
   * Invokes an OpenFaaS function container using the faas-cli
   *
   * @returns {Promise}
   */
  invoke() {
    const fnConfig = this.serverless.service.getFunction(this.options.function);
    const cli = this.provider.cli.invoke(
      ...getArgs(
        this.serverless.service.provider,
        this.options,
        FAAS_CLI_INVOKE_FLAGS,
      ),
      fnConfig.name,
    );
    cli.process.stdin.write('\n');
    cli.process.stdin.end();
    return cli.promise;
  }
}

module.exports = OpenFaasInvoke;
