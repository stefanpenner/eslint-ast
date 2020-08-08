'use strict';

// private a nice module API require('@eslint-ast/eslint-plugin-graphql');
//
// Yes, package.json#main would work, but only for `main` given that we also
// want to export `parser` as
// require('@eslint-ast/eslint-plugin-graphql/parser') keeping them next to
// each other is nice "unsurprising"
module.exports = require('./eslint/index');
