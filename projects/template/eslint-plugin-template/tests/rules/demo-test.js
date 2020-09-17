'use strict';

const { RuleTester } = require('eslint');

const tester = new RuleTester({
  parser: `${__dirname}/../../parser.js`,
});

describe('example/demo-rule', function () {
  it('works', function () {
    tester.run('example/demo-rule', require('../../rules/demo'), {
      valid: [],
      invalid: [],
    });
  });
});
