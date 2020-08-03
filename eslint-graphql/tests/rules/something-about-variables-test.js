'use strict';

const { RuleTester } = require('eslint');

const tester = new RuleTester({
  parser: `${__dirname}/../../eslint/parser.js`,
});

describe('graphql/something-about-variables', function() {
  it.skip('works', function(){
    tester.run(
      'graphql/some',
      require('eslint-plugin-graphql/rules/something-about-variables'),
      {
        valid: [
`fragment apple on User {
  updatedAt @skip(if: $someFreeVariable)
}`
        ],
        invalid: [ ] });
  });
});

