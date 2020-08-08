'use strict';

module.exports = {
  meta: {
    messages: {
    },
    docs: {
      description: 'a rule demo',
      category: 'problem',
    },
  },
  create(context) {
    return {
      'Rule Declaration[property=color] Identifier[name=bubblegum]'(node) {
        context.report({
          message: 'bad color',
          node
        });
      }
    };
  }
}
