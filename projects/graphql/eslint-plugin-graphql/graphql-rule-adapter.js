'use strict';
const { TypeInfo, ValidationContext } = require('graphql');

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
      const typeInfo = new TypeInfo(context.parserServices.getSchema());
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
        }
      );
      const rules = rule(validationContext);

      const callbacks = { enter() {}, exit() {} };

      wrappedRules['*'] = function(node) {
        typeInfo.enter(context.parserServices.correspondingNode(node));
        callbacks.enter(node);
        callbacks.exit(node);
      };

      for (const ruleName in rules) {
        const rule = rules[ruleName];
        const type = typeof rule;
        if (type === 'function') {
          // eslint visitor
          const callback = function(node) {
            // graphql visitor
            return rules[ruleName](
              /* node        */ context.parserServices.correspondingNode(node),
              /* TODO: key (Not currently used by validations) */ undefined,
              /* parent      */ context.parserServices.correspondingNode(node.parent),
              /* TODO: path (Not currently used by validations) */ undefined,
              /* ancestors   */ ancestors(node).map(ancestor =>
                context.parserServices.correspondingNode(ancestor)
              )
            );
          };

          // this handles the scenario with visitor.enter
          if (ruleName === 'enter') {
            callbacks.enter = callback;
          } else if (ruleName === 'leave') {
            callbacks.leave = callback;
          } else {
            wrappedRules[ruleName] = callback;
          }
        } else if (type === 'object' && rule !== null) {
          let hadVisitor = false;
          // bridge graphql document.leave with eslint's document:leave selector
          if (typeof rule.enter === 'function') {
            hadVisitor = true;
            // eslint visitor
            wrappedRules[ruleName] = function(node) {
              // graphql visitor
              return rule.enter(
                /* node       */ context.parserServices.correspondingNode(node),
                /* TODO: key (Not currently used by validations)  */ undefined,
                /* parent     */ context.parserServices.correspondingNode(node.parent),
                /* TODO: path (Not currently used by validations) */ undefined,
                /* ancestors  */ ancestors(node).map(ancestor =>
                  context.parserServices.correspondingNode(ancestor)
                )
              );
            };
          }

          if (typeof rule.leave === 'function') {
            hadVisitor = true;
            // eslint visitor
            wrappedRules[ruleName + ':exit'] = function(node) {
              // graphql visitor
              return rule.leave(
                /* node       */ context.parserServices.correspondingNode(node),
                /* TODO: key (Not currently used by validations) */ undefined,
                /* parent     */ context.parserServices.correspondingNode(node.parent),
                /* TODO: path (Not currently used by validations) */ undefined,
                /* ancestors  */ ancestors(node).map(ancestor =>
                  context.parserServices.correspondingNode(ancestor)
                )
              );
            };
          }

          if (!hadVisitor) {
            throw new Error(`Unsupported rule member: ${Object.keys(rule)}`);
          }
        } else {
          throw new Error(`Unknown rule type: '${type}'`);
        }
      }

      return wrappedRules;
    },
  };
};
