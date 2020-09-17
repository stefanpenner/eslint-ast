'use strict';

const commentMatcher = require('./comment-regexp');
module.exports = function commentToEsNode(lineString, { index, line }) {
  const matched = commentMatcher(lineString);
  if (!matched) {
    return null;
  }

  const startColumn = lineString.indexOf(matched.comment);
  const endColumn = matched.endColumn;

  return {
    __proto__: null,
    type: 'Comment',
    value: matched.comment,
    range: [index + startColumn, index + endColumn],
    loc: {
      start: {
        column: startColumn,
        line,
      },
      end: {
        column: endColumn,
        line,
      },
    },
  };
};
