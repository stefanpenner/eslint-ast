# @eslint-ast/eslint-plugin-graphql

Provides native eslint support for graphql

This project converts graphql AST into an AST eslint supports, and then
provides native eslint functionality for both authoring new graphql validation
rules, and running graphql's provided validation rules.

## Usage

```sh
yarn add @eslint-ast/eslint-plugin-graphql
# Versions of eslint prior to 7.0.0 are not supported
yarn add eslint@^7.0.0
```

```js
// .eslintrc.js
module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.graphql',
      parser: '@eslint-ast/eslint-plugin-graphql/parser',
      parserOptions: {
        schema: `${__dirname}/path/to/schema.graphql`,
      },
      plugins: ['@eslint-ast/eslint-plugin-graphql'],
      extends: require.resolve('@eslint-ast/eslint-plugin-graphql/recommended.js'),
    },
  ],
};
```

#### Full support for eslint-disable comments

```
# eslint-disable <rule-name>, <rule-2-name>, ... <rule-n-name>
# eslint-enable <rule-name>, <rule-2-name>, ... <rule-n-name>
# eslint-disable-line
# eslint-disable-line <rule-name>, <rule-2-name>, ... <rule-n-name>
# eslint-disable-next-line
# eslint-disable-next-line <rule-name>, <rule-2-name>, ... <rule-n-name>
```

For our built-in rules, they will have the name structure:

```
# eslint-disable @eslint-ast/graphql/single-top-level-query
```

For rules we run from graphql's own library they will have the following naming convention

```
# eslint-disable @eslint-ast/graphql/ExecutableDefinitionsRule
```

## vim-coc users

1. open `:CocLocalConfig`
2. add `'graphql'` to `'eslint.filetypes'`

If you prefer, you can add this to your global coc config via `:CocConfig`.

## vscode users

1. Install Extensions

- `GraphQL`
- `ESLint`

2. Enable linting on GraphQL in your `settings.json` and add `graphql` to the list of filetypes in `eslint.validate`

```
{
    "eslint.validate": [
      // ... other files
      "graphql"
    ],
}
```

## List Of Validations:

This project includes some of its own rules:

- single-top-level-query

This project supports and executes all of graphql's own validations as of version 15.3.0; they are:

- ExecutableDefinitionsRule
- UniqueOperationNamesRule
- LoneAnonymousOperationRule
- SingleFieldSubscriptionsRule
- KnownTypeNamesRule
- FragmentsOnCompositeTypesRule
- VariablesAreInputTypesRule
- ScalarLeafsRule
- FieldsOnCorrectTypeRule
- UniqueFragmentNamesRule
- KnownFragmentNamesRule
- NoUnusedFragmentsRule
- PossibleFragmentSpreadsRule
- NoFragmentCyclesRule
- UniqueVariableNamesRule
- NoUndefinedVariablesRule
- NoUnusedVariablesRule
- KnownDirectivesRule
- UniqueDirectivesPerLocationRule
- KnownArgumentNamesRule
- UniqueArgumentNamesRule
- ValuesOfCorrectTypeRule
- ProvidedRequiredArgumentsRule
- VariablesInAllowedPositionRule
- OverlappingFieldsCanBeMergedRule
- UniqueInputFieldNamesRule

## Troubleshooting

### Parsing Error

If you see errors like

```
/Users/me/src/project/query.graphql
  1:6  error  Parsing error: ';' expected
```

You are likely parsing `.graphql` files as if they were JavaScript and need to
set the `parser` option in your `.eslintrc`. See the Usage section for
details.

### Strange Crashes

If you see strange crashes similar to:

```
TypeError: Cannot read property 'internal' of null
Occurred while linting /Users/me/src/project/query.graphql:0
```

You may be on an older version of `eslint`. `eslint@7.0.0` or higher is required.
