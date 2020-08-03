'use strict';

// this rule errors if we have more then one top level query
module.exports = {
  meta: {
    messages: {
    },
    docs: {
      description: 'ensure imports are valid',
      category: 'problem',
    },
  },
  create(context) {
    return {
      CommentImportStatement(node) {
        const importIdentifier = node.name.value
        debugger;
      },
    };
  }
}
