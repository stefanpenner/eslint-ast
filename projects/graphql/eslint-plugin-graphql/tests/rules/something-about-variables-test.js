'use strict';

const tester = require('./rule-tester');

// TODO: complete this
it.skip('works', function () {
  tester.run('graphql/some', require('eslint-plugin-graphql/rules/something-about-variables'), {
    valid: [
      `fragment apple on User {
  updatedAt @skip(if: $someFreeVariable)
}`,
    ],
    invalid: [],
  });
});
