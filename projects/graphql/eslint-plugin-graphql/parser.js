'use strict';

const path = require('path');
const fs = require('fs');

const { parse, buildSchema, visit } = require('graphql');
const visitorKeys = require('graphql/language/visitor').QueryDocumentKeys;

const toEslintAST = require('./lib/to-eslint-ast');

module.exports.parseForESLint = function (code, options = {}) {
  let graphqlAST;
  const filePath =
    (typeof options === 'object' && options !== null && options.filePath) || '<unknown file>';
  try {
    graphqlAST = parse(code, options);
  } catch (e) {
    e.message = `${e.message}\n Could not parse file: ${filePath}\n File Contents:\n ${code}\n`;
    e.file = filePath;
    throw e;
  }

  let schemaString;
  let schema;

  if (options.schema) {
    // if we are given an absolute path, automatically just read it
    if (path.isAbsolute(options.schema)) {
      schemaString = fs.readFileSync(options.schema, 'UTF8');
    } else {
      throw new Error(
        `options.schema in your .eslintrc must be an absolute path; did you mean '\${__dirname}/${options.schema}'`,
      );
    }

    schema = buildSchema(schemaString);
  }

  const ast = toEslintAST(graphqlAST, code);
  // turn graphql AST into eslint compatible AST
  return {
    ast,

    // TODO: actually implement when we need it
    scopeManager: {
      scopes: [{ set: new Map(), variables: [], through: [] }],
      getDeclaredVariables() {
        throw new Error('Not Yet Implemented');
      },
    },

    // TODO: tests services
    services: {
      getSchema() {
        return schema;
      },
      getDocument() {
        return this.correspondingNode(ast);
      },
      parse(source) {
        return toEslintAST(parse(source, options), source);
      },

      // a way to move between a Node in ESLint AST, and its corresponding graphql AST and back
      // document(node) {
      //   const graphqlASTNode = context.parserServices.correspondingNode(node);
      //   const  eslintAstNode = context.parserServices.correspondingNode(graphqlASTNode);
      //
      //   node === eslintAstNode // => true
      // }
      correspondingNode(node) {
        return toEslintAST.correspondingNode(node);
        // somethings this isunexpected null, which suggests graphql may sometimes reconstruct a given node
        // as can be seen in graphql-rule-adapter
        //
        // TODO: debug this, and decide on the appropriate solution
      },

      visit(ast, visitor) {
        if (typeof ast === 'string') {
          ast = parse(ast, options);
        }
        visit(ast, visitor, visitorKeys);
      },

      toEslintAST(ast) {
        return toEslintAST(ast);
      },

      getFragmentDefinitionsFromSource(source) {
        const fragmentDefinitions = [];
        visit(parse(source), {
          FragmentDefinition(node) {
            fragmentDefinitions.push(toEslintAST(node));
          },
        });

        return fragmentDefinitions;
      },
    },
    visitorKeys,
  };
};
