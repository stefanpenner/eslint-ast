'use strict';

// this rule errors if we have more then one top level query
module.exports = {
  meta: {
    messages: {
      multipleQueries: 'multiple top level queries found'
    },
    docs: {
      description: 'disallow more then one top level query',
      category: 'problem',
    },
  },
  create(context) {

  }
};
