const spawn = require('../../utils/spawn');
const Logger = require('../../utils/logger');

/**
 * Wrapper around the faas-cli, handling i/o and using promises
 * @class
 * @todo Initialize with logger
 */
class FaasCli {
  /**
   * Executes a faas-cli command with arbitrary arguments
   *
   * @example
   * exec('build', '--lang', 'node', '--handler', './handler', '--image', 'handler:latest');
   * @param {...string} args - args to pass to faas-cli
   * @returns {Spawn}
   */
  static exec(...args) {
    return spawn(
      'faas-cli',
      args,
      { logger: new Logger('faas-cli', 33) },
    );
  }

  /**
   * Builds OpenFaaS function containers
   *
   * @example
   * build('--lang', 'node', '--handler', './handler', '--image', 'handler:latest');
   * @param {...string} args - args to pass to faas-cli
   * @returns {Spawn}
   */
  build(...args) {
    return this.constructor.exec('build', ...args);
  }

  /**
   * Deploys OpenFaaS function containers
   *
   * @param {...string} args - args to pass to faas-cli
   * @returns {Spawn}
   */
  deploy(...args) {
    return this.constructor.exec('deploy', ...args);
  }

  /**
   * Lists OpenFaaS functions
   *
   * @param {...string} args - args to pass to faas-cli
   * @returns {Spawn}
   */
  list(...args) {
    return this.constructor.exec('list', ...args);
  }

  /**
   * Invokes an OpenFaaS function
   *
   * @param {...string} args - args to pass to faas-cli
   * @returns {Spawn}
   */
  invoke(...args) {
    return this.constructor.exec('invoke', ...args);
  }
}

module.exports = FaasCli;
