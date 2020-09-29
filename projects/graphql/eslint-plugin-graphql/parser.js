'use strict';

const path = require('path');
const fs = require('fs');

const { parse, visit, TypeInfo } = require('graphql');
const visitorKeys = require('graphql/language/visitor').QueryDocumentKeys;

const toEslintAST = require('./lib/to-eslint-ast');
const debug = require('debug')('eslint-plugin-graphql:parser');

const memoizedBuildSchema = require('./lib/memoized-build-schema');

module.exports.parseForESLint = function (code, options = {}) {
  let graphqlAST;
  const filePath =
    (typeof options === 'object' && options !== null && options.filePath) || '<unknown file>';
  try {
    debug('parse:start');
    graphqlAST = parse(code, options);
    debug('parse:end');
  } catch (e) {
    e.message = `${e.message}\n Could not parse file: ${filePath}\n File Contents:\n ${code}\n`;
    e.file = filePath;
    throw e;
  }

  let schemaString;
  let schema;

  if (typeof options.schema !== 'string') {
    throw new Error(
      'ESLint parser "@eslint-ast/graphql" requires parser option "schema", an absolute path to a GraphQL schema',
    );
  }

  if (options.schema) {
    // if we are given an absolute path, automatically just read it
    if (path.isAbsolute(options.schema)) {
      debug('read-file-sync:start');
      schemaString = fs.readFileSync(options.schema, 'UTF8');
      debug('read-file-sync:end');
    } else {
      throw new Error(
        `options.schema in your .eslintrc must be an absolute path; did you mean '\${__dirname}/${options.schema}'`,
      );
    }

    schema = memoizedBuildSchema(schemaString);
  }

  debug('to-eslint-ast:start');
  const ast = toEslintAST(graphqlAST, code);
  debug('to-eslint-ast:end');
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

    services: {
      getSchema() {
        return schema;
      },
      getDocument() {
        return this.correspondingNode(ast);
      },

      createTypeInfo() {
        return new TypeInfo(schema);
      },

      parse(source) {
        return toEslintAST(parse(source, options), source);
      },

      pathOf(node, delimiter = '/') {
        let parts = [];
        while (typeof node === 'object' && node !== null) {
          switch (node.type) {
            case 'Field':
              parts.unshift(node.name.value);
              break;
            case 'OperationDefinition':
              parts.unshift(node.operation);
              break;
            case 'InlineFragment':
              parts.unshift(`... on ${node.typeCondition.name.value}`);
              break;
            case 'ObjectTypeDefinition':
            case 'InterfaceTypeDefinition':
            case 'FragmentDefinition':
            case 'FieldDefinition':
              parts.unshift(node.name.value);
              break;
          }
          node = node.parent;
        }
        return parts.join(delimiter);
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
