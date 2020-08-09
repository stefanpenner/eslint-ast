'use strict';

const { RuleTester } = require('eslint');

const tester = new RuleTester({
  parser: `${__dirname}/../../eslint/parser.js`,
});

describe('example/demo-rule', function() {
  it('works', function(){
    tester.run(
      'example/demo-rule',
      require('../../eslint/rules/demo'),
      {
        valid: [
          `print("Hello world")`
        ],
        invalid: [
          {
            code: `print("BAD WORD")`,
            errors: [
              {
                type: 'TODO',
                message: 'BAD WORD'
              }
            ]
          }
        ]
      });
  });
});
