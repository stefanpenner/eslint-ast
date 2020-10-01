'use strict';
const { ValidationContext } = require('graphql');

function ancestors(node) {
  const result = [];

  while ((node = node.parent)) {
    result.push(node);
  }

  return result;
}
/*
 * this method takes a graphql/validations rule, and ensures it functions within
 * the eslint parser.
 *
 * It accomplishes this by:
 *
 * * automatically mapping between ESLint AST nodes and graphql AST nodes
 * * providing a mapping from graphql validators reportError function to
 *   eslint's report function
 *
 * This all ensures that we don't leak ESlint specific concepts into the
 * Graphql World, and vise-versa.
 */
module.exports = function adapt(rule) {
  if (typeof rule !== 'function') {
    throw new Error('Missing Rule');
  }

  return {
    create(context) {
      const wrappedRules = Object.create(null);
      const typeInfo = context.parserServices.createTypeInfo();

      const validationContext = new ValidationContext(
        context.parserServices.getSchema(),
        context.parserServices.getDocument(),
        typeInfo,
        function onError(error) {
          const errorNode = error.nodes[0];
          const node = context.parserServices.correspondingNode(errorNode) || {
            type: errorNode.kind,
            // TODO: sometimes nodes are missing, maybe graphql creates new nodes sometimes?
            loc: {
              start: {
                line: errorNode.loc.startToken.line,
                column: errorNode.loc.startToken.column,
              },
              end: {
                line: errorNode.loc.endToken.line,
                column: errorNode.loc.endToken.column,
              },
            },
          };

          context.report({
            ...error,
            node,
          });
        },
      );
      // This is a GraphQL Visitor, which is either EnterLeave or a ShapeMap
      // see https://github.com/graphql/graphql-js/blob/bbd8429b85594d9ee8cc632436e2d0f900d703ef/src/language/visitor.js#L11
      const ruleVisitor = rule(validationContext);

      const callbacks = { enter() {}, leave() {} };

      wrappedRules['*'] = function (node) {
        typeInfo.enter(context.parserServices.correspondingNode(node));
        // here we call the enter/leave visitor AND the shape visitor
        // but they are mutually exclusive
        // see impl https://github.com/graphql/graphql-js/blob/3aad20bf1cccda59ccb8d855584097fcf7348fef/src/language/visitor.js#L404-L436
        callbacks.enter(node);
        if (node.type in ruleVisitor) {
          let visitNode = ruleVisitor[node.type];
          if ('enter' in visitNode && typeof visitNode.enter === 'function') {
            return visitNode.enter(
              /* node       */ context.parserServices.correspondingNode(node),
              /* TODO: key (Not currently used by validations)  */ undefined,
              /* parent     */ context.parserServices.correspondingNode(node.parent),
              /* TODO: path (Not currently used by validations) */ undefined,
              /* ancestors  */ ancestors(node).map(ancestor =>
                context.parserServices.correspondingNode(ancestor),
              ),
            );
          }
        }
      };

      wrappedRules['*:exit'] = function (node) {
        if (node.type in ruleVisitor) {
          let visitNode = ruleVisitor[node.type];
          if ('leave' in visitNode && typeof visitNode.leave === 'function') {
            return visitNode.leave(
              /* node       */ context.parserServices.correspondingNode(node),
              /* TODO: key (Not currently used by validations)  */ undefined,
              /* parent     */ context.parserServices.correspondingNode(node.parent),
              /* TODO: path (Not currently used by validations) */ undefined,
              /* ancestors  */ ancestors(node).map(ancestor =>
                context.parserServices.correspondingNode(ancestor),
              ),
            );
          }
        }
        callbacks.leave(node);
        typeInfo.leave(context.parserServices.correspondingNode(node));
      };

      for (const visitorNodeName in ruleVisitor) {
        const visitorNode = ruleVisitor[visitorNodeName];

        const type = typeof visitorNode;
        if (type === 'function') {
          // eslint visitor
          const callback = function (node) {
            // graphql visitor
            return ruleVisitor[visitorNodeName](
              /* node        */ context.parserServices.correspondingNode(node),
              /* TODO: key (Not currently used by validations) */ undefined,
              /* parent      */ context.parserServices.correspondingNode(node.parent),
              /* TODO: path (Not currently used by validations) */ undefined,
              /* ancestors   */ ancestors(node).map(ancestor =>
                context.parserServices.correspondingNode(ancestor),
              ),
            );
          };

          // this handles the scenario with visitor.enter
          if (visitorNodeName === 'enter') {
            // {
            //  enter() {}
            // }
            //
            callbacks.enter = callback;
          } else if (visitorNodeName === 'leave') {
            // {
            //  leave() {}
            // }
            //
            callbacks.leave = callback;
          } else {
            // {
            //  Field() {}
            // }
            //
            // In this case we'll add an ESLint visitor for the specific node.
            // The typeInfo would be out of order on leave, but the node
            // doens't have a leave hook in this format as it's
            //
            // {
            //  Field() {}
            // }
            //
            // as opposed to
            //
            // {
            //  Field {
            //    enter() {}
            //    leave() {}
            //  }
            // }
            //
            wrappedRules[visitorNodeName] = callback;
          }
        } else {
          if (
            type === 'object' &&
            visitorNode !== null &&
            ('enter' in visitorNode || 'leave' in visitorNode)
          ) {
            continue;
          }
          throw new Error(`Unknown rule type: '${type}'`);
        }
      }

      return wrappedRules;
    },
  };
};
