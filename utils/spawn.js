const { spawn } = require('child_process');

/**
 * @typedef Spawn
 * @memberof Utils
 * @property {Object} process - NodeJS ChildProcess
 * @property {Promise} promise
 */

/**
 * Spawns a NodeJS child process with a Promise and custom logging
 *
 * @memberof Utils
 * @param {string} command - The command to run.
 * @param {string[]} args - List of string arguments.
 * @param {Object} options - NodeJS child_process.spawn options
 * @param {Object} options.logger - Custom logger for stderr/stdout
 * @returns {Spawn}
 */
const spawnPromise = (command, args = [], options = {}) => {
  let process;
  const promise = new Promise((resolve, reject) => {
    process = spawn(command, args, { ...options, stdio: 'pipe' });

    process.stdout.on('data', (data) => {
      if (options.logger && options.logger.log) {
        options.logger.log(data.toString('utf8'));
      }
    });

    process.stderr.on('data', (data) => {
      if (options.logger && options.logger.err) {
        options.logger.err(data.toString('utf8'));
      }
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });
    process.on('error', reject);
  });

  return {
    process,
    promise,
  };
};

module.exports = spawnPromise;
