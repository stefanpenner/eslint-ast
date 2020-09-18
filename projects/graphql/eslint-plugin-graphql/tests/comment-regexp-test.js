'use strict';

const { expect } = require('chai');
const commentMatcher = require('../lib/maybe-comment');

describe('comment-matcher', function () {
  it('works', function () {
    expect(commentMatcher('')).to.eql(null);
    expect(commentMatcher('a')).to.eql(null);
    expect(commentMatcher('a#')).to.eql(null);
    expect(commentMatcher('#b')).to.eql({
      comment: 'b',
      startColumn: 1,
      endColumn: 1,
    });
    expect(commentMatcher('a#b')).to.eql({
      comment: 'b',
      startColumn: 2,
      endColumn: 2,
    });
    expect(commentMatcher('a#some comment')).to.eql({
      comment: 'some comment',
      startColumn: 2,
      endColumn: 13,
    });
    expect(commentMatcher('a#some comment#a')).to.eql({
      comment: 'some comment#a',
      startColumn: 2,
      endColumn: 15,
    });
  });
});
