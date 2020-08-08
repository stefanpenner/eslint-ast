'use strict';

const { expect } = require('chai');

describe('parser', function() {
  const parser = require('./../eslint/parser');

  it('looks about right', function() {
    expect(parser.parseForESLint).to.be.a('function');
  });

  it('provides a good error if graphql could not parse', function() {
    expect(() => {
      parser.parseForESLint('');
    }).to.throw(/^Syntax Error: Unexpected <EOF>./);

    expect(() => {
      parser.parseForESLint('');
    }).to.throw(/Could not parse file: <unknown file>/);

    expect(() => {
      parser.parseForESLint('');
    }).to.throw(/File Contents:\n \n$/);

    expect(() => {
      parser.parseForESLint('', { filePath: 'some-file.graphql' });
    }).to.throw(/^Syntax Error: Unexpected <EOF>./);

    expect(() => {
      parser.parseForESLint('', { filePath: 'some-file.graphql' });
    }).to.throw(/Could not parse file: some-file.graphql/);

    expect(() => {
      parser.parseForESLint('', { filePath: 'some-file.graphql' });
    }).to.throw(/File Contents:\n \n$/);

    expect(() => {
      parser.parseForESLint('random content{');
    }).to.throw(/^Syntax Error: Unexpected Name "random"./);

    expect(() => {
      parser.parseForESLint('random content{', { filePath: 'some-file.graphql' });
    }).to.throw(/Could not parse file: some-file.graphql/);

    expect(() => {
      parser.parseForESLint('random content{');
    }).to.throw(/File Contents:\n random content{\n$/);
  });

  it('produces reasonable output', function() {
    // we will rely on other more unit tests, or integration tests to ensure the actual complexity is tests
    const result = parser.parseForESLint('fragment apple on Fruit { id }', { filePath: 'some-file.graphql' });
    expect(result).to.have.keys(['ast', 'scopeManager', 'visitorKeys']);
  });
});
