'use strict';

const { RuleTester } = require('eslint');

module.exports = new RuleTester({
  parser: `${__dirname}/../../eslint/parser.js`,
  parserOptions : {
    filename: 'test-file.graphql'
  }
});
