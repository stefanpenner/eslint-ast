'use strict';
const { expect } = require('chai');

describe('graphql-eslint plugin', function() {
  const plugin = require('../eslint/');

  it('has expected rules', function() {
    expect(plugin.rules['single-top-level-query']).to.be.a('object');

    for (const ruleName of [
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
      "UniqueInputFieldNamesRule"
    ]) {
      expect(plugin.rules[ruleName]).to.be.a('object');
    }
  });

  it('has the expected members', function() {
    expect(plugin).to.have.keys([
      'rules',
      'meta',
      'create'
    ]);
    expect(plugin.rules).to.be.a('object');
    expect(plugin.meta).to.be.a('object');
    expect(plugin.create).to.be.a('function');
  })
});
