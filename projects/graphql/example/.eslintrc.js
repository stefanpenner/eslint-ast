module.exports = {
  root: true,
  env: {
    browser: false,
    commonjs: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
  overrides: [
    {
      files: '**/*.graphql',
      parser: '@eslint-ast/eslint-plugin-graphql/parser',
      parserOptions: {
        schema: `${__dirname}/schema.graphql`,
      },
      plugins: ['@eslint-ast/eslint-plugin-graphql'],
      extends: require.resolve('@eslint-ast/eslint-plugin-graphql/recommended.js'),
    },
  ],
};
