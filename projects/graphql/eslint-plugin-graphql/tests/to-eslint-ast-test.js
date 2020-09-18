const { parse } = require('graphql');
const { expect } = require('chai');

const toEslintAST = require('../lib/to-eslint-ast');
const { correspondingNode } = toEslintAST;

describe('eslint friendly AST', function() {
  it('allows lookup of corresponding node. To ease traversing one AST but having easy access to the original node, without polluting the AST', function() {
    {
      const source = `query { id }`;
      const graphql = parse(source);
      const eslint = toEslintAST(graphql, source);
      expect(graphql).to.not.eql(eslint);
      expect(eslint).to.be;
      expect(graphql).to.be;
      expect(correspondingNode(graphql)).to.eql(eslint);
      expect(correspondingNode(eslint)).to.eql(graphql);
    }

    {
      const source = `
type Apple {
  id: String
}

type Query {
  Apples: [Apple]
}`;

      const graphql = parse(source);
      const eslint = toEslintAST(graphql, source);
      expect(graphql).to.not.eql(eslint);
      expect(correspondingNode(graphql)).to.eql(eslint);
      expect(correspondingNode(eslint)).to.eql(graphql);

      expect(eslint.definitions[0]).to.be;
      expect(graphql.definitions[0]).to.be;
      expect(correspondingNode(eslint.definitions[0])).to.eql(graphql.definitions[0]);
      expect(correspondingNode(graphql.definitions[0])).to.eql(eslint.definitions[0]);
    }
  });

  it('converts simple query', function() {
    const source = `query { id }`;
    const graphql = parse(source);

    const eslint = toEslintAST(graphql, source);
    const definitions = eslint.definitions;

    delete eslint.definitions; // to make the diff easier
    expect(eslint).to.deep.eql({
      type: 'Document',
      loc: {
        start: {
          column: 0,
          line: 0,
        },
        end: {
          column: 13,
          line: 1,
        },
      },

      tokens: [],
      comments: [],
      range: [0, 12],
    });

    const selectionSet = definitions[0].selectionSet;
    delete definitions[0].selectionSet; // to make the diff easier
    expect(definitions).to.eql([
      {
        type: 'OperationDefinition',
        directives: [],
        loc: {
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 12,
          },
        },
        range: [0, 12],
        name: undefined,
        operation: 'query',
        variableDefinitions: [],
      },
    ]);

    expect(selectionSet).to.eql({
      type: 'SelectionSet',
      loc: {
        end: { line: 1, column: 12 },
        start: { line: 1, column: 7 },
      },
      range: [6, 12],
      selections: [
        {
          alias: undefined,
          arguments: [],
          directives: [],
          loc: {
            end: { line: 1, column: 9 },
            start: { line: 1, column: 9 },
          },
          name: {
            loc: {
              end: { line: 1, column: 9 },
              start: { line: 1, column: 9 },
            },
            range: [8, 10],
            type: 'Name',
            value: 'id',
          },
          range: [8, 10],
          selectionSet: undefined,
          type: 'Field',
        },
      ],
    });
  });

  it('converts simple query with comments', function() {
    const source = `query { id } # hi`;
    const graphql = parse(source);
    const eslint = toEslintAST(graphql, source);

    delete eslint.definitions; // to make the diff easier
    expect(eslint).to.deep.eql({
      type: 'Document',
      loc: {
        start: {
          column: 0,
          line: 0,
        },
        end: {
          column: 18,
          line: 1,
        },
      },

      tokens: [],
      comments: [
        {
          type: 'Comment',
          value: ' hi',
          range: [14, 16],
          loc: {
            end: {
              column: 16,
              line: 1,
            },
            start: {
              column: 14,
              line: 1,
            },
          },
        },
      ],
      range: [0, 17],
    });
  });

  it('converts with many comments', function() {
    const source = `
# one
query { # two
  id # three
} # four
# #five`;

    const graphql = parse(source);
    const eslint = toEslintAST(graphql, source);

    delete eslint.definitions; // to make the diff easier
    expect(eslint).to.deep.eql({
      type: 'Document',
      loc: {
        start: {
          column: 0,
          line: 0,
        },
        end: {
          column: 8,
          line: 6,
        },
      },

      tokens: [],
      comments: [
        {
          type: 'Comment',
          value: ' one',
          loc: {
            start: {
              column: 1,
              line: 2,
            },
            end: {
              column: 4,
              line: 2,
            },
          },
          range: [1, 4],
        },
        {
          type: 'Comment',
          value: ' two',
          loc: {
            end: {
              column: 12,
              line: 3,
            },
            start: {
              column: 9,
              line: 3,
            },
          },
          range: [14, 17],
        },
        {
          type: 'Comment',
          value: ' three',
          loc: {
            end: {
              column: 11,
              line: 4,
            },
            start: {
              column: 6,
              line: 4,
            },
          },
          range: [24, 29],
        },
        {
          type: 'Comment',
          value: ' four',
          loc: {
            end: {
              column: 7,
              line: 5,
            },
            start: {
              column: 3,
              line: 5,
            },
          },
          range: [33, 37],
        },

        {
          type: 'Comment',
          value: ' #five',
          loc: {
            end: {
              column: 6,
              line: 6,
            },
            start: {
              column: 1,
              line: 6,
            },
          },
          range: [39, 44],
        },
      ],
      range: [0, 50],
    });
  });

  it('converts schema', function() {
    const source = `
type Apple {
  id: String
}
type Query {
  Apples: [Apple]
}`;

    const graphql = parse(source);
    const document = toEslintAST(graphql, source);
    const definitions = document.definitions;

    delete document.definitions;

    expect(document).to.deep.eql({
      type: 'Document',
      loc: {
        start: { line: 0, column: 0 },
        end: { line: 7, column: 2 },
      },
      range: [0, 61],
      comments: [],
      tokens: [],
    });

    expect(definitions.length).to.eql(2);
    const definition = definitions[0];
    expect(definition.fields.length).to.eql(1);
    const field = definition.fields[0];
    delete definition.fields;
    expect(definition).to.eql({
      type: 'ObjectTypeDefinition',
      description: undefined,
      directives: [],
      interfaces: [],
      name: {
        loc: {
          end: { line: 2, column: 6 },
          start: { line: 2, column: 6 },
        },
        range: [6, 11],
        type: 'Name',
        value: 'Apple',
      },
      loc: {
        end: { line: 4, column: 1 },
        start: { line: 2, column: 1 },
      },
      range: [1, 28],
    });

    expect(field).to.eql({
      arguments: [],
      description: undefined,
      directives: [],
      loc: {
        end: { line: 3, column: 7 },
        start: { line: 3, column: 3 },
      },
      name: {
        loc: {
          end: { line: 3, column: 3 },
          start: { line: 3, column: 3 },
        },
        range: [16, 18],
        type: 'Name',
        value: 'id',
      },
      range: [16, 26],
      type: 'FieldDefinition',
    });
  });
});
