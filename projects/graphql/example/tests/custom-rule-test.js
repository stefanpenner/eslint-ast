const { expect } = require('chai');
const { RuleTester } = require('eslint');
const ruleTester = new RuleTester({
  parser: '@eslint-ast/eslint-plugin-graphql/parser',
  parser: require.resolve(`${__dirname}/../../eslint-plugin-graphql/parser`),
  parserOptions: {
    schema: `${__dirname}/fixtures/schema.graphql`,
  },
});

// This is a very odd way of testing parserServices.pathOf
// However we do it this way because we don't have parent edges between nodes
// after parsing: this is added at some other time.  I believe it happens
// during eslint's run of the visitor pattern for its rules so fully testing
// parser services w/fully hydrated nodes seems to be best done indirectly via
// rule testing.
describe('custom rules', function () {
  const noBookTitleRule = {
    type: 'problem',
    meta: {
      messages: {
        msg: 'msg: {{ path }} // {{ pathCustomDelim }}',
      },
    },
    create(context) {
      function isSelectingTitle(selectionSet) {
        return selectionSet.selections.find(f => {
          switch (f.type) {
            case 'Field':
              return f.name.value === 'title';
          }
        });
      }

      return {
        SelectionSet(node) {
          if (node.parent.type === 'FragmentDefinition') {
            return;
          }

          let selectingTitle = isSelectingTitle(node);
          if (selectingTitle) {
            context.report({
              node,
              messageId: 'msg',
              data: {
                path: context.parserServices.pathOf(node),
                pathCustomDelim: context.parserServices.pathOf(node, ' :: '),
              },
            });
          }
        },
      };
    },
  };

  ruleTester.run('no-book-title', noBookTitleRule, {
    valid: [
      {
        code: `
        query {
          bookstores {
            name
          }
        }
      `,
      },
    ],
    invalid: [
      // simple case
      {
        code: `
        query {
          bookstores(max:200) {
            books {
              title
            }
          }
        }
      `,
        errors: [
          {
            messageId: 'msg',
            data: {
              path: 'query/bookstores/books',
              pathCustomDelim: 'query :: bookstores :: books',
            },
          },
        ],
      },
      // // multiple selections in selection set
      {
        code: `
        query {
          bookstores {
            books {
              sales
              title
              author {
                name
              }
            }
          }
        }
      `,
        errors: [
          {
            messageId: 'msg',
            data: {
              path: 'query/bookstores/books',
              pathCustomDelim: 'query :: bookstores :: books',
            },
          },
        ],
      },
      // path through inline fragments
      {
        code: `
        query {
          packages {
            ... on OnlineDeliveryPackage {
              url
              contents {
                ... on Book {
                  author
                  title
                }
              }
            }
          }
        }
      `,
        errors: [
          {
            messageId: 'msg',
            data: {
              path: 'query/packages/... on OnlineDeliveryPackage/contents/... on Book',
              pathCustomDelim:
                'query :: packages :: ... on OnlineDeliveryPackage :: contents :: ... on Book',
            },
          },
        ],
      },
    ],
  });

  const noFieldNamedPotato = {
    type: 'problem',
    meta: {
      messages: {
        msg: 'msg: {{ path }} // {{ pathCustomDelim }}',
      },
    },
    create(context) {
      return {
        FieldDefinition(node) {
          if (node.name.value === 'potato') {
            context.report({
              node,
              messageId: 'msg',
              data: {
                path: context.parserServices.pathOf(node),
                pathCustomDelim: context.parserServices.pathOf(node, ' :: '),
              },
            });
          }
        },
        Field(node) {
          if (node.name.value === 'potato') {
            context.report({
              node,
              messageId: 'msg',
              data: {
                path: context.parserServices.pathOf(node),
                pathCustomDelim: context.parserServices.pathOf(node, ' :: '),
              },
            });
          }
        },
      };
    },
  };

  ruleTester.run('no-field-named-potato', noFieldNamedPotato, {
    valid: [
      {
        code: `
        type SeemsLegit {
          id: Int
          name: String
        }
      `,
      },
    ],
    invalid: [
      // type definition
      {
        code: `
        type FoodOpinions implements Opinion {
          potato: String
        }

        interface Opinion {
          potato: String
        }

        fragment MightBeSelectingPotato on FoodOpinions {
          potato
        }
      `,
        errors: [
          {
            messageId: 'msg',
            data: {
              path: 'FoodOpinions/potato',
              pathCustomDelim: 'FoodOpinions :: potato',
            },
          },
          {
            messageId: 'msg',
            data: {
              path: 'Opinion/potato',
              pathCustomDelim: 'Opinion :: potato',
            },
          },
          {
            messageId: 'msg',
            data: {
              path: 'MightBeSelectingPotato/potato',
              pathCustomDelim: 'MightBeSelectingPotato :: potato',
            },
          },
        ],
      },
    ],
  });
});
