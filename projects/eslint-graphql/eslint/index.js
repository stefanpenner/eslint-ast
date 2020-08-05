"use strict";

module.exports = {
  rules: {
     get 'single-top-level-query'() {
       return require('./rules/single-top-level-query');
     }
  },

  // TODO:
  meta: {
    type: "",

    docs: {
      description: "disallow more then one query in a file",
      category: "",
      recommended: true,
      url: ""
    },

    fixable: "",
    schema: [] // no options
  },

  create: function(context) {
    // TODO:
    return {
      // callback functions
    };
  }
};
