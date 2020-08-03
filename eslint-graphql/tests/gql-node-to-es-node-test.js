'use strict';

const { expect } = require('chai');

describe('gql-node-to-es-node', function() {
  const gqlToEs = require('../eslint/gql-node-to-es-node');

  function gqlNode(kind) {
    return {
      kind, loc: {
        start: 0,
        end: 99,
        startToken: { line: 0, column: 0 },
        endToken: { line: 99, column: 99 }
      }
    };
  }

  it('it is shaped correctly', function() {
    const node = gqlNode('apple');

    expect(node).to.not.have.property('type');
    expect(node).to.not.have.property('comments');
    expect(node).to.not.have.property('range');
    expect(node).to.not.have.property('tokens');

    gqlToEs(node);

    expect(node).to.have.property('type', 'apple');
    expect(node).to.have.property('comments');
    expect(node).to.have.property('range');
    expect(node).to.have.property('tokens');
  });

  it('maps kind to type', function() {
    const node = gqlNode('apple');
    expect(node).to.not.have.property('type');
    gqlToEs(node);
    expect(node).to.have.property('type', 'apple');
  });

  it('maps loc', function() {
    const node = gqlNode('apple');

    gqlToEs(node);

    expect(node.loc).to.eql({
      end: {
        column: 99,
        line: 99,
      },
      start: {
        column: 0,
        line: 0,
      }
    });
  });

  it('maps range', function() {
    const node = gqlNode('apple');
    gqlToEs(node);
    expect(node.range).to.eql([0, 99]);
  });
});
