'use strict';

const { specifiedRules } = require('graphql/validation');
const adapt = require('./lib/graphql-rule-adapter');
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
  'ExecutableDefinitionsRule',
  'UniqueOperationNamesRule',
  'LoneAnonymousOperationRule',
  'SingleFieldSubscriptionsRule',
  'KnownTypeNamesRule',
  'FragmentsOnCompositeTypesRule',
  'VariablesAreInputTypesRule',
  'ScalarLeafsRule',
  'FieldsOnCorrectTypeRule',
  'UniqueFragmentNamesRule',
  'KnownFragmentNamesRule',
  'NoUnusedFragmentsRule',
  'PossibleFragmentSpreadsRule',
  'NoFragmentCyclesRule',
  'UniqueVariableNamesRule',
  'NoUndefinedVariablesRule',
  'NoUnusedVariablesRule',
  'KnownDirectivesRule',
  'UniqueDirectivesPerLocationRule',
  'KnownArgumentNamesRule',
  'UniqueArgumentNamesRule',
  'ValuesOfCorrectTypeRule',
  'ProvidedRequiredArgumentsRule',
  'VariablesInAllowedPositionRule',
  'OverlappingFieldsCanBeMergedRule',
  'UniqueInputFieldNamesRule',
];

for (const ruleName of RULES) {
  let rule = specifiedRules.find(rule => rule.name === ruleName);
  if (typeof rule !== 'function') {
    throw new Error(`Unable to find GraphQL lint rule '${ruleName}'`);
  }
  rules[ruleName] = adapt(rule);
}

module.exports = {
  rules,

  // TODO:
  meta: {
    type: '',

    docs: {
      description: 'graphql eslint support',
      category: '',
      recommended: true,
      url: '',
    },

    fixable: '',
    schema: [], // no options
  },

  create: function (/* context */) {
    return {};
  },
};
