'use strict';

const { RuleTester } = require('eslint');

const tester = new RuleTester({
  parser: `${__dirname}/../../eslint/parser.js`,
});

describe('graphql/validate-imports', function() {
  it('works', function(){
    tester.run(
      'graphql/validate-imports',
      require('eslint-plugin-graphql/rules/validate-imports'),
      {
        valid: [
          `
#import '_my-file.graphql'
query foo {
  bar {
    ...myFragment
  }
}
`
        ],
        invalid: [

        ]
      });
  });
});
