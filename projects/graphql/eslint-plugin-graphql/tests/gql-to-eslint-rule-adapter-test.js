const { specifiedRules } = require('graphql/validation');
const adapt = require('../lib/graphql-rule-adapter');
const tester = require('./rules/rule-tester');
const adaptedRule = adapt(specifiedRules[0]);

tester.run('foo', adaptedRule, {
  valid: [`fragment Apple on Fruit { id }`],
  invalid: [],
});

tester.run('foo', adaptedRule, {
  valid: [],
  invalid: [
    {
      code: `type User { id: String! }`,
      errors: [
        {
          type: 'ObjectTypeDefinition',
          message: 'The "User" definition is not executable.',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 26,
        },
      ],
    },
  ],
});
