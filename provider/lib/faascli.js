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
   * @returns {Promise}
   */
  static exec(...args) {
    return spawn(
      'faas-cli',
      args,
      { logger: new Logger('faas-cli', 33) },
    ).promise;
  }

  /**
   * Builds OpenFaaS function containers
   *
   * @example
   * build('--lang', 'node', '--handler', './handler', '--image', 'handler:latest');
   * @param {...string} args - args to pass to faas-cli
   * @returns {Promise}
   */
  build(...args) {
    return this.constructor.exec('build', ...args);
  }

  /**
   * Deploys OpenFaaS function containers
   *
   * @param {...string} args - args to pass to faas-cli
   * @returns {Promise}
   */
  deploy(...args) {
    return this.constructor.exec('deploy', ...args);
  }

  /**
   * Lists OpenFaaS functions
   *
   * @param {...string} args - args to pass to faas-cli
   * @returns {Promise}
   */
  list(...args) {
    return this.constructor.exec('list', ...args);
  }
}

module.exports = FaasCli;
