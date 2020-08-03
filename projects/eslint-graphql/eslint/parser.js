'use strict';

const { parse, visit } = require('graphql');
const gqlToEs = require('./gql-node-to-es-node');
const parseImports = require('./parse-imports');

module.exports.parseForESLint = function(code, options) {
  let ast;

  const filePath = typeof options === 'object' && options !== null && options.filePath || '<unknown file>';
  try {
    ast = parse(code, options)
  } catch(e) {
    e.message = `${e.message}\n Could not parse file: ${filePath}\n File Contents:\n ${code}\n`;
    e.file = filePath;
    throw e;
  }

  // turn graphql AST into eslint compatible AST
  visit(ast, { enter: gqlToEs });

  // handle comment import statements
  // since graphql AST ignores comments, we have to do that ourselves for
  // imports
  ast.definitions.unshift(...parseImports(code))

  return {
    ast,
    // TODO: actually implement when we need it
    scopeManager: {
      scopes: [
        { set: new Map(), variables: [], through: [] }
      ],
      getDeclaredVariables() {
        debugger
      }
    },
    service: {
      getFilePath() {
        return filePath;
      }
    },
    // TODO: verify this is the required set. Note: if something isn't here, it
    // will "auto visit". But specifying it here, will prevent traversal of unexpected members
    visitorKeys: {
      "Document": [ "definitions" ],
      "FragmentDefinition": ["typeCondition","directives","selectionSet"],
      "NamedType": [],
      "SelectionSet": ["selections"],
      "OperationDefinition": ["variableDefinitions","directives","selectionSet"],
      "Field": ["alias","arguments","directives","selectionSet"],
      "FragmentSpread": ["directives"]
    }
  }
};
