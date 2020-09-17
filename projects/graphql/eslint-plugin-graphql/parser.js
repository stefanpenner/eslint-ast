'use strict';

const { parse, buildSchema } = require('graphql');
const Traverser = require('eslint/lib/shared/traverser');
const path = require('path');
const fs = require('fs');

const toEslintAST = require('./to-eslint-ast');

const visitorKeys = require('graphql/language/visitor').QueryDocumentKeys;

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
  let typeInfo;

  if (options.schema) {
    // if we are given an absolute path, automatically just read it
    if (path.isAbsolute(options.schema)) {
      schemaString = fs.readFileSync(options.schema, 'UTF8');
    } else {
      // otherwise resolve, that enables us to resolve relative the path of the file
      schemaString = fs.readFileSync(
        resolve(options.schema, {
          basedir: path.dirname(options.filePath),
        }),
        'UTF8'
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
        // TODO:parse with options?
        return toEslintAST(parse(source), source);
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

      getFragmentDefinitionsFromSource(source) {
        const fragmentDefinitions = [];
        const ast = this.parse(source);

        // TODO: might be fun to provide a `visit` helper, with 100% same experience as the eslint one.
        const traverser = new Traverser();
        traverser.traverse(ast, {
          visitorKeys,
          enter(node) {
            if (node.type === 'FragmentDefinition') {
              fragmentDefinitions.push(node);
            }
          },
        });

        return fragmentDefinitions;
      },
    },
    visitorKeys,
  };
};
