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
    process.stdout.write(`\x1b[0;${this.color}m[${this.name}]\t${message}\x1b[0m`);
  }

  /**
   * Writes a message to stderr
   *
   * @param {string} message
   */
  err(message) {
    process.stderr.write(`\x1b[0;${this.color}m[${this.name}]\t${message}\x1b[0m`);
  }
}

module.exports = Logger;
