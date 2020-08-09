'use strict';

const { expect } = require('chai');
const commentToEsNode = require('../eslint/comment-to-es-node');

describe('building comment node from line', function() {
  it('works', function() {
    expect(commentToEsNode('', { index: 0, line: 0 })).to.eql(null);
    expect(commentToEsNode('#', { index: 0, line: 0 })).to.eql(null);
    expect(commentToEsNode('#a', { index: 0, line: 0 })).to.eql({
      type: 'Comment',
      range: [1, 1],
      value: 'a',
      loc: {
        start: {
          column: 1,
          line: 0,
        },
        end: {
          column: 1,
          line: 0,
        }
      }
    });

   expect(commentToEsNode('#a', { index: 10, line: 5 })).to.eql({
      type: 'Comment',
      range: [11, 11],
      value: 'a',
      loc: {
        start: {
          column: 1,
          line: 5,
        },
        end: {
          column: 1,
          line: 5,
        }
      }
    });

    expect(commentToEsNode('a#b', { index: 0, line: 0 })).to.eql({
      type: 'Comment',
      range: [2, 2],
      value: 'b',
      loc: {
        start: {
          column: 2,
          line: 0,
        },
        end: {
          column: 2,
          line: 0,
        }
      }
    });

    expect(commentToEsNode('a#b#c', { index: 0, line: 0 })).to.eql({
      type: 'Comment',
      range: [2, 4],
      value: 'b#c',
      loc: {
        start: {
          column: 2,
          line: 0,
        },
        end: {
          column: 4,
          line: 0,
        }
      }
    });

    expect(commentToEsNode('a#b#c', { index: 10, line: 5 })).to.eql({
      type: 'Comment',
      range: [12, 14],
      value: 'b#c',
      loc: {
        start: {
          column: 2,
          line: 5,
        },
        end: {
          column: 4,
          line: 5,
        }
      }
    });
  });
});
