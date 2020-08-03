'use strict';
const matchImport = require('./match-import');

module.exports = function parseImports(source) {
  const imports = [];
  let count = 0;
  let lineCount = 0;
  for (const line of source.split('\n')) {
    lineCount++;
    const match = matchImport(line);

    if (match) {
      const value = match.importIdentifier;
      imports.push({
        type: 'CommentImportStatement',
        name: {
          type: 'Name',
          value,
          loc: {
            start: {
              line: lineCount,
              column: 9,
            },
            end: {
              line: lineCount,
              column: 9 + value.length,
            }
          },
          tokens: [],
          comments: [],
          range: [count + 9, count + 9 + value.length]
        }
      })
    }
    count += line.length + 1 /* newline yo TODO: windows EOL */;
  }
  return imports;
}
