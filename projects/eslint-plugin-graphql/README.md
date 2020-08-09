# eslint-graphql

Provides native eslint support for graphql

This project converts graphql AST into an AST eslint supports, and then
provides native eslint functionality for both authoring new graphql validation
rules, and running graphql's provided validation rules.

## Usage

```sh
yarn add @eslint-ast/eslint-plugin-graphql
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
        schema: `${__dirname}/path/to/schema.graphql`
      },
      plugins: [
        '@eslint-ast/eslint-plugin-graphql',
      ],
      extends: require.resolve('@eslint-ast/eslint-plugin-graphql/recommended.js'),
    },
  ],
};
```

## vim-coc users

1. open `:CocConfig`
2. add `'graphql'` to `'eslint.filetypes'`


