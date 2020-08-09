'use strict';

module.exports = {
  rules: {
    '@eslint-ast/graphql/single-top-level-query': 'error',
    '@eslint-ast/graphql/ExecutableDefinitionsRule': 'off', // TODO
    '@eslint-ast/graphql/UniqueOperationNamesRule': 'error',
    '@eslint-ast/graphql/LoneAnonymousOperationRule': 'error',
    '@eslint-ast/graphql/SingleFieldSubscriptionsRule': 'error',
    '@eslint-ast/graphql/KnownTypeNamesRule': 'error',
    '@eslint-ast/graphql/FragmentsOnCompositeTypesRule': 'error',
    '@eslint-ast/graphql/VariablesAreInputTypesRule': 'error',
    '@eslint-ast/graphql/ScalarLeafsRule': 'error',
    '@eslint-ast/graphql/FieldsOnCorrectTypeRule': 'error',
    '@eslint-ast/graphql/UniqueFragmentNamesRule': 'error',
    '@eslint-ast/graphql/KnownFragmentNamesRule': 'error',
    '@eslint-ast/graphql/NoUnusedFragmentsRule': 'error',
    '@eslint-ast/graphql/PossibleFragmentSpreadsRule': 'error',
    '@eslint-ast/graphql/NoFragmentCyclesRule': 'error',
    '@eslint-ast/graphql/UniqueVariableNamesRule': 'error',
    '@eslint-ast/graphql/NoUndefinedVariablesRule': 'error',
    '@eslint-ast/graphql/NoUnusedVariablesRule': 'error',
    '@eslint-ast/graphql/KnownDirectivesRule': 'error',
    '@eslint-ast/graphql/UniqueDirectivesPerLocationRule': 'error',
    '@eslint-ast/graphql/KnownArgumentNamesRule': 'error',
    '@eslint-ast/graphql/UniqueArgumentNamesRule': 'error',
    '@eslint-ast/graphql/ValuesOfCorrectTypeRule': 'error',
    '@eslint-ast/graphql/ProvidedRequiredArgumentsRule': 'error',
    '@eslint-ast/graphql/VariablesInAllowedPositionRule': 'error',
    '@eslint-ast/graphql/OverlappingFieldsCanBeMergedRule': 'error',
    '@eslint-ast/graphql/UniqueInputFieldNamesRule': 'error',
  }
};
