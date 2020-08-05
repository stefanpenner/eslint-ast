'use strict';

const { RuleTester } = require('eslint');

const tester = new RuleTester({
  parser: `${__dirname}/../../eslint/parser.js`,
});

describe('graphql/single-top-level-query', function() {
  it('works', function(){
    tester.run(
      'graphql/single-top-level-query',
      require('eslint-plugin-graphql/rules/single-top-level-query'),
      {
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
}`
        ],
        invalid: [

          {// two queries
            code: `
        query { fooBar { id } }
        query { fooBar { id } }
        `,
            errors: [
              { message: 'multiple top level queries found' },
              { message: 'multiple top level queries found' }
            ]
          },


          {// two queries (with names)
            code: `
        query Foo { fooBar { id } }
        query Bar { fooBar { id } }
        `,
            errors: [
              { message: 'multiple top level queries found' },
              { message: 'multiple top level queries found' }
            ]
          },
          {// three queries
            code: `
        query { fooBar { id } }
        query { fooBar { id } }
        query { fooBar { id } }
        `,
            errors: [
              { message: 'multiple top level queries found' },
              { message: 'multiple top level queries found' },
              { message: 'multiple top level queries found' }
            ]
          }
        ]

      });
  });
});
