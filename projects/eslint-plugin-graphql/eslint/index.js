"use strict";

const graphql = require('graphql');
const { specifiedRules } = require('graphql/validation');

const adapt = require('./graphql-rule-adapter');
const rules = {
  get 'single-top-level-query'() {
    return require('./rules/single-top-level-query');
  },
};
// these are the rules we explicitly import from graphql/validations.
// These are hard-coded so that we can attempt to remain semver compliant.
//
// If graphql adds rules, yes we will need to update this list
const RULES = [
  "ExecutableDefinitionsRule",
  "UniqueOperationNamesRule",
  "LoneAnonymousOperationRule",
  "SingleFieldSubscriptionsRule",
  "KnownTypeNamesRule",
  "FragmentsOnCompositeTypesRule",
  "VariablesAreInputTypesRule",
  "ScalarLeafsRule",
  "FieldsOnCorrectTypeRule",
  "UniqueFragmentNamesRule",
  "KnownFragmentNamesRule",
  "NoUnusedFragmentsRule",
  "PossibleFragmentSpreadsRule",
  "NoFragmentCyclesRule",
  "UniqueVariableNamesRule",
  "NoUndefinedVariablesRule",
  "NoUnusedVariablesRule",
  "KnownDirectivesRule",
  "UniqueDirectivesPerLocationRule",
  "KnownArgumentNamesRule",
  "UniqueArgumentNamesRule",
  "ValuesOfCorrectTypeRule",
  "ProvidedRequiredArgumentsRule",
  "VariablesInAllowedPositionRule",
  "OverlappingFieldsCanBeMergedRule",
  "UniqueInputFieldNamesRule",
];

for (const ruleName of RULES) {
  rules[ruleName] = adapt(specifiedRules.find(rule => rule.name === ruleName));
}

module.exports = {
  rules,

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
    return { };
  }
};
