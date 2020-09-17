module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.css',
      parser: '@eslint-ast/eslint-plugin-css/parser',
      plugins: ['@eslint-ast/eslint-plugin-css'],

      rules: {
        '@eslint-ast/css/demo': 'error',
      },
    },
  ],
};
