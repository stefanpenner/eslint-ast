module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  printWidth: 98,
  overrides: [
    {
      files: ['**/*.hbs'],
      options: { parser: 'glimmer' },
    },
  ],
};
