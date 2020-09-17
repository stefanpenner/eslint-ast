'use strict';

const CORRESPONDING_NODE = new WeakMap();
const commentToEsNode = require('./comment-to-es-node');
// This exists for now, while eslint still works on being AST agnostics
module.exports = function toEslintAST(input, source, visited = new WeakSet()) {
  visited.add(input);
  const output = Object.create(null);
  // so when needed, we can grab the original node without polluting the new node
  // via context.parserServices.originalNode(node);
  CORRESPONDING_NODE.set(output, input);
  CORRESPONDING_NODE.set(input, output);

  for (let key of Object.keys(input)) {
    switch (key) {
      case 'type':
        break;
      case 'range':
        break;
      case 'kind': {
        output.type = input.kind;
        break;
      }
      case 'loc': {
        const { loc } = input;

        output.loc = {
          __proto__: null,
          start: {
            __proto__: null,
            line: loc.startToken.line,
            column: loc.startToken.column,
          },
          end: {
            __proto__: null,
            line: loc.endToken.line,
            column: loc.endToken.column,
          },
        };

        output.range = [loc.start, loc.end];
        break;
      }
      default: {
        const value = input[key];

        if (typeof value === 'object' && value !== null) {
          if (visited.has(value)) {
            break;
          } else if (Array.isArray(value)) {
            const result = [];
            for (let i = 0; i < value.length; i++) {
              result[i] = toEslintAST(value[i], null, visited);
            }
            output[key] = result;
          } else {
            output[key] = toEslintAST(value, null, visited);
          }
        } else {
          output[key] = value;
        }

        break;
      }
    }
  }

  if (output.type === 'Document') {
    output.tokens = [];

    const comments = [];
    let lineCount = 1;
    let indexPosition = 0;
    for (const line of source.split(/\r\n|\n/)) {
      const comment = commentToEsNode(line, {
        index: indexPosition,
        line: lineCount,
      });
      if (comment) {
        comments.push(comment);
      }
      lineCount++;
      indexPosition += line.length;
    }

    output.comments = comments;
  }
  return output;
};

module.exports.correspondingNode = function correspondingNode(node) {
  return CORRESPONDING_NODE.get(node);
};
