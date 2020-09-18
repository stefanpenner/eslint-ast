'use strict';

module.exports = {
  rules: {
    get demo() {
      return require('./rules/demo');
    },
  },

  // TODO:
  meta: {
    type: '',

    docs: {
      description: '',
      category: '',
      recommended: true,
      url: '',
    },

    fixable: '',
    schema: [], // no options
  },

  create: function(context) {
    return {
      // callback functions
    };
  },
};
