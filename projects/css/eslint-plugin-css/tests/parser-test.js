'use strict';

const { expect } = require('chai');
const parser = require('./../parser');

describe('parser', function () {
  it('looks about right', function () {
    expect(parser.parseForESLint).to.be.a('function');
  });

  it.skip('provides a good error if extension could not parse', function () {
    expect(() => {
      parser.parseForESLint('a {');
    }).to.throw(/File Contents:\n \n$/);

    expect(() => {
      parser.parseForESLint('{', { filePath: 'some-file.extension' });
    }).to.throw(/^Syntax Error: Unexpected <EOF>./);

    expect(() => {
      parser.parseForESLint('', { filePath: 'some-file.extension' });
    }).to.throw(/Could not parse file: some-file.extension/);

    expect(() => {
      parser.parseForESLint('', { filePath: 'some-file.extension' });
    }).to.throw(/File Contents:\n \n$/);

    expect(() => {
      parser.parseForESLint('random content');
    }).to.throw(/^Syntax Error: Unexpected Name "random"./);

    expect(() => {
      parser.parseForESLint('random content', { filePath: 'some-file.extension' });
    }).to.throw(/Could not parse file: some-file.extension/);

    expect(() => {
      parser.parseForESLint('random content');
    }).to.throw(/File Contents:\n random content{\n$/);
  });

  it.skip('produces reasonable output', function () {
    // we will rely on other more unit tests, or integration tests to ensure the actual complexity is tests
    const result = parser.parseForESLint('<example source>', { filePath: 'some-file.extension' });
    expect(result).to.have.keys(['ast', 'scopeManager', 'visitorKeys']);
  });
});
