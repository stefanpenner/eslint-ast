module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.example',
      parser: '@eslint-ast/eslint-plugin-example/parser',
      plugins: [
        '@eslint-ast/eslint-plugin-example',
      ],

      rules: {
        '@eslint-ast/example/demo': 'error',
      },
    },
  ],
};
