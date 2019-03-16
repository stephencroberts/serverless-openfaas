const { getArgs } = require('../utils/args');

const FAAS_CLI_BUILD_FLAGS = [
  '--build-arg',
  '--build-option',
  '--handler',
  '--image',
  '--lang',
  '--name',
  '--no-cache',
  '--parallel',
  '--shrinkwrap',
  '--squash',
  '--tag',
];

/**
 * Package plugin - `sls package`
 * @class
 */
class OpenFaasPackage {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('openfaas');

    this.commands = {
      package: {
        usage: 'Builds OpenFaaS function containers',
        options: {
          function: {
            usage: 'Function name -- builds a single function container',
            shortcut: 'f',
          },
          image: {
            usage: 'Docker image tag (defaults to function config)',
            shortcut: 'i',
          },
          // How the heck do you remove options you don't use?
          stage: { usage: 'Not used' },
          region: { usage: 'Not used' },
          package: { usage: 'Not used' },
        },
      },
    };

    this.hooks = {
      'before:package:createDeploymentArtifacts': this.validate.bind(this),
      'package:createDeploymentArtifacts': this.createDockerImages.bind(this),
    };
  }

  /**
   * Validates the command before trying to run it
   *
   * @throws Error
   */
  validate() {
    if (this.options.image && Array.isArray(this.options.function)) {
      throw new Error('Option --image may only be used for a single function');
    }
  }

  /**
   * Creates a docker image for the given function
   *
   * @param {Object} fnConfig - serverless function config object
   * @returns {Promise}
   */
  createDockerImage(fnConfig) {
    return this.provider.cli.build(
      ...getArgs(fnConfig, this.options, FAAS_CLI_BUILD_FLAGS),
    ).promise;
  }

  /**
   * Creates docker images for all serverless functions
   *
   * @returns {Promise}
   */
  createDockerImages() {
    const functions = this.options.function
      ? [].concat(this.options.function || [])
      : this.serverless.service.getAllFunctions();

    return Promise.all(
      functions.map(
        funcName => this.createDockerImage(this.serverless.service.getFunction(funcName)),
      ),
    );
  }
}

module.exports = OpenFaasPackage;
