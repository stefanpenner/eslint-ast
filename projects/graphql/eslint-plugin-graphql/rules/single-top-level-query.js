'use strict';

// this rule errors if we have more then one top level query
module.exports = {
  meta: {
    messages: {
      multipleQueries: 'multiple top level queries found',
    },
    docs: {
      description: 'disallow more then one top level query',
      category: 'problem',
    },
  },
  create(context) {
    let queryCount = 0;
    let firstQueryNode = null;

    return {
      OperationDefinition(node) {
        if (node.operation !== 'query') {
          return;
        }
        if (queryCount === 0) {
          firstQueryNode = node;
        } else if (queryCount === 1) {
          context.report({
            messageId: 'multipleQueries',
            node: firstQueryNode,
          });
        }

        queryCount++;
        if (queryCount === 1) {
          return;
        }

        context.report({
          messageId: 'multipleQueries',
          node,
        });
      },
    };
  },
};
