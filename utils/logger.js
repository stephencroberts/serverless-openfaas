/**
 * Custom logging with a name prefix and a random terminal color
 * @class
 * @memberof Utils
 */
class Logger {
  /**
   * @example
   * const myProcessLogger = new Logger('myprocess');
   * @param {string} name - name of the process using the logger
   * @param {number} [color=random] - color code
   */
  constructor(name, color) {
    this.color = color || Math.floor(Math.random() * (7) + 31);
    this.name = name;
  }

  /**
   * Writes a message to stdout
   *
   * @param {string} message
   */
  log(message) {
    message.toString('utf8').split('\n').forEach((line) => {
      process.stdout.write(`\x1b[0;${this.color}m[${this.name}]\t${line}\x1b[0m\n`);
    });
  }

  /**
   * Writes a message to stderr
   *
   * @param {string} message
   */
  err(message) {
    message.toString('utf8').split('\n').forEach((line) => {
      process.stderr.write(`\x1b[0;${this.color}m[${this.name}]\t${line}\x1b[0m\n`);
    });
  }
}

module.exports = Logger;
