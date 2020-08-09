'use strict';
const COMMENT_REGEXP = Object.freeze(/#(.+)(:?\r\n|\n)?$/);

module.exports = function(line) {
  const match = line.match(COMMENT_REGEXP);
  if (!Array.isArray(match)) { return null; }

  const comment = match[1];
  return {
    comment,
    startColumn: line.indexOf(comment),
    endColumn: line.length - 1,
  };
};
