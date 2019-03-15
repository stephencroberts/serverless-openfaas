const parseOptionsEnv = optionsEnv => [].concat(optionsEnv || [])
  .map(opt => opt.split('='))
  .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

const parseFnEnv = fnEnv => Object.entries(fnEnv)
  .map(([k, v]) => ({ [`${k}`]: v }))
  .reduce((acc, entry) => ({ ...acc, ...entry }), {});

/**
 * Gets an array of cli arguments from config objects with optional filtering of
 * allowable args
 *
 * @memberof Utils
 * @param {...Object} args -  Arbitrary number of objects. Config objects must
 *                            be shallow except for the "env" or "environment"
 *                            keys which should also be shallow objects of
 *                            key/value pairs.
 * @returns {string[]} cli arguments
 */
const getArgs = (...args) => {
  // Grab the optional allowedArgs array from the last argument
  const actualArgs = args.slice();
  let allowedArgs;
  if (Array.isArray(args[args.length - 1])) {
    allowedArgs = actualArgs.pop();
  }

  // Sorry, this is gnarly, but abstracts away a lot of complexity.
  return Object.entries(actualArgs
    // Normalize objects that have env vars
    .map((arg) => {
      // If it has an "env" key, it's the serverless options
      if (arg.env) { return { ...arg, env: parseOptionsEnv(arg.env) }; }
      // If it has an "environment" key, it's an openfaas function config
      if (arg.environment) { return { ...arg, env: parseFnEnv(arg.environment) }; }
      // Pass it on through, setting default env
      return { ...arg, env: {} };
    })
    // Merge config objects in the order given (last wins)
    .reduce((acc, arg) => ({
      ...acc,
      ...arg,
      env: { ...acc.env, ...arg.env },
    }), { env: {} }))
    // Filter by the allowedArgs given (if any)
    .filter(([k]) => (allowedArgs ? allowedArgs.includes(`--${k}`) : true))
    // Expand env vars to an array of cli arguments
    .map(([k, v]) => (k === 'env'
      ? Object.entries(v).map(([envKey, envValue]) => ['env', `${envKey}=${envValue}`])
      : [[k, v]]
    ))
    // Flatten array-of-arrays
    .reduce((acc, entries) => acc.concat(entries), [])
    // Only accept string arguments
    .filter(([, v]) => (typeof v === 'string' || v instanceof String))
    // Add the cli flag prefix
    .reduce((acc, entry) => acc.concat([`--${entry[0]}`, entry[1]]), []);
};

module.exports = {
  getArgs,
};
