# eslint-graphql

Provides native eslint support for graphql

This project converts graphql AST into an AST eslint supports, and then
provides native eslint functionality.

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
      plugins: [
        '@eslint-ast/eslint-plugin-graphql',
      ],

      rules: {
        '@eslint-ast/graphql/single-top-level-query': 'error'
      },
    },
  ],
};
```

## vim-coc users

1. open `:CocConfig`
2. add `'graphql'` to `'eslint.filetypes'`


