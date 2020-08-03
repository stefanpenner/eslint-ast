module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.graphql',
      parser: 'eslint-plugin-example/parser',
      plugins: [
        'eslint-plugin-example',
      ],

      rules: {
        'example/first-rule': 'error',
      },
    },
  ],
};
