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
