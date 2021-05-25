# @eslint-ast/eslint-plugin-graphql

Provides native eslint support for graphql

This project converts graphql AST into an AST eslint supports, and then provides native eslint functionality for both
authoring new graphql validation rules, and running graphql's provided validation rules.

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
      parserOptions: {
        schema: `${__dirname}/path/to/schema.graphql`,
      },
      extends: ['plugin:eslint-ast/graphql/recommended']
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

For rules, we run from graphql's own library they will have the following naming convention

```
# eslint-disable @eslint-ast/graphql/ExecutableDefinitionsRule
```

## Parser Util Functions

The parser provides useful [util functions](/projects/graphql/eslint-plugin-graphql/parser.js) you can use while writing
your rules. You can access these in your `create` function via `context.parserServices.*`.

### Util Functions

| Function Name| Description |
| :----------- | :----------- |
| getSchema() | Get the schema source that was configured with the parser in .eslintrc.js |
| getDocument() | Returns eslint node of the entire graphql document ast |
| getGraphQL() | Get the `graphql` instance from `require('graphql')` used in the parser. See #27 for more information on why this is useful |
| createTypeInfo() | Returns a instance of [TypeInfo](https://graphql.org/graphql-js/utilities/#typeinfo) from `graphql` library |
| parse(:string) | Parse the given graphql source into an eslint ast. |
| pathOf(:object<node>) | Return a string which is the path to a nested projection. Such as `query/grandParent/parent/child` |
| correspondingNode(:object<node>) | Given a graphql node, will return eslint node. Given an eslint node, will return graphql node. |
| toEslintAST(:object<ast>) | Takes a graphql ast and converts it into a eslint ast |
| getFragmentDefinitionsFromSource(:string) | Returns array of `FragmentDefinition` from a given query source. |

### Usage Example

```javascript
module.exports = {
  // ... rule metadata properties

  create(context) {
    const typeInfo = context.parserServices.createTypeInfo();

    return {
      '*'(node) {
        typeInfo.enter(context.parserServices.correspondingNode(node));
      },
      '*:exit'(node) {
        typeInfo.leave(context.parserServices.correspondingNode(node));
      },

      SelectionSet(node) {
        let parentType = typeInfo.getParentType();

      },
    };
  },
}
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

You are likely parsing `.graphql` files as if they were JavaScript and need to set the `parser` option in
your `.eslintrc`. See the Usage section for details.

### Strange Crashes

If you see strange crashes similar to:

```
TypeError: Cannot read property 'internal' of null
Occurred while linting /Users/me/src/project/query.graphql:0
```

You may be on an older version of `eslint`. `eslint@7.0.0` or higher is required.
