const { spawn } = require('child_process');

/**
 * @typedef FaasCliPromise
 * @type Promise
 */

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
   * @returns {FaasCliPromise}
   */
  static exec(...args) {
    return new Promise((resolve, reject) => {
      const faasCli = spawn('faas-cli', args, { stdio: 'pipe' });

      let stdout = '';
      faasCli.stdout.on('data', (data) => {
        console.log(data.toString('utf8')); // eslint-disable-line no-console
        stdout += data.toString('utf8');
      });

      let stderr = '';
      faasCli.stderr.on('data', (data) => {
        stderr += data.toString('utf8');
      });

      faasCli.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`${stdout}\n${stderr}`));
        } else {
          resolve();
        }
      });

      faasCli.on('error', reject);
    });
  }

  /**
   * Builds OpenFaaS function containers
   *
   * @example
   * build('--lang', 'node', '--handler', './handler', '--image', 'handler:latest');
   * @param {...string} args - args to pass to faas-cli
   * @returns {FaasCliPromise}
   */
  build(...args) {
    return this.constructor.exec('build', ...args);
  }
}

module.exports = FaasCli;
