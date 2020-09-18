'use strict';

const tester = require('./rule-tester');

tester.run('graphql/single-top-level-query', require('../../rules/single-top-level-query'), {
  valid: [
    // no query, just fragment
    `fragment Apple on Fruit { id }`,
    // one query
    `query { fooBar { id }}`,
    `
query {
 allSavedSearches {
    query
    objectWithComplexMutations{
      mutation{
        id
        name
      }
    }
    objectWithSubscription {
      subscription
    }
  }
}`,
  ],
  invalid: [
    {
      // two queries
      code: `
        query { fooBar { id } }
        query { fooBar { id } }
        `,
      errors: [
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 32,
        },
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 32,
        },
      ],
    },

    {
      // two queries (with names)
      code: `
        query Foo { fooBar { id } }
        query Bar { fooBar { id } }
        `,
      errors: [
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 36,
        },
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 36,
        },
      ],
    },
    {
      // three queries
      code: `
        query { fooBar { id } }
        query { fooBar { id } }
        query { fooBar { id } }
        `,
      errors: [
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 32,
        },
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 32,
        },
        {
          message: 'multiple top level queries found',
          type: 'OperationDefinition',
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 32,
        },
      ],
    },
  ],
});
