module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.template',
      parser: '@eslint-ast/eslint-plugin-template/parser',
      plugins: ['@eslint-ast/eslint-plugin-template'],

      rules: {
        '@eslint-ast/example/demo': 'error',
      },
    },
  ],
};
