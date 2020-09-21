'use strict';
const { buildSchema } = require('graphql');
const crypto = require('crypto');
const debug = require('debug')('eslint-plugin-graphql:cached-build-schema');
let CACHE = Object.create(null);
/*
 * When profiling large real-world schemas we noticed that for a particular 500kb schema:
 *
 * fs.readFileSync was: < 1ms
 * warm graphql.parse was: ~10ms
 * warm graphql.buildSchema was: ~180ms
 *
 * So to address this, it was decided to memoize schema construction. Auditing
 * relevant code suggests this is safe, and will save upwards of 200ms per
 * graphql file linted, when dealing with a schema of ~500kb.
 *
 * Cache key generation:
 * Since reading the file costs < 1 ms, and md5 hex of full 500kb schema only
 * takes < ~0.5ms. We would error on the side of safety and always read and
 * compute the key from the complete schema. Given that file reading and key
 * generation appears to consume less then 1% of the uncached time, this
 * memoization safes us nearly ~180ms per linted file on a modern MBP, with a
 * schema of 500kb
 *
 * Cache lifetime:
 *
 * By default the cache will survive for the duration of the process, given
 * that projects have relatively few schemas this should be fine.
 *
 * Although unlikely, if issues arise there is an API to purge the cache in
 * question. NOTE: using this function is not expected behavior, if you are
 * using this please let us know, as it could be a sign of an underlying issue.
 *
 *
 * ```js
 * require('eslint-plugin-graphql/lib/memoized-build-schema').clear();
 * ```
 *
 *
 * Note: This memoization is expected to primarily be of benefit when:
 * * linting many graphql files in one session
 * * a persistent linting solution
 */
module.exports = function memoizedBuildSchema(schemaString) {
  debug('key:start');
  const key = crypto.createHash('md5').update(schemaString).digest('hex');
  debug('key:end');

  const value = CACHE[key];

  if (value === undefined) {
    // miss
    debug('miss');
    debug('build-schema:start');
    CACHE[key] = buildSchema(schemaString);
    debug('build-schema:end');
    return CACHE[key];
  } else {
    debug('hit');
    // hit
    return value;
  }
};

/*
 *
 * Although unlikely, if issues arise there is an API to purge the cache in
 * question. NOTE: using this function is not expected behavior, if you are
 * using this please let us know, as it could be a sign of an underlying issue.
 */
module.exports.clear = function () {
  CACHE = Object.create(null);
};
