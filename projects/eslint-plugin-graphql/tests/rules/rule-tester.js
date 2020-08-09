'use strict';

const { RuleTester } = require('eslint');

// Make RuleTester work nicely with mocha
// documented here: https://eslint.org/docs/developer-guide/nodejs-api#ruletester
RuleTester.describe = function(text, method) {
    RuleTester.it.title = text;
    return describe(text, method);
};

RuleTester.it = function(text, method) {
  it(RuleTester.it.title + ": " + text, method);
};

const schema = `${__dirname}/schema.graphql`
const tester =  new RuleTester({
  parser: `${__dirname}/../../eslint/parser.js`,
  parserOptions : {
    filename: 'test-file.graphql',
    schema
  }
});

module.exports = tester;
