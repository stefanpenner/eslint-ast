'use strict';

const { expect } = require('chai');

describe('parse-imports', function() {
  const parseImports = require('../eslint/parse-imports');
  const matchImport = require('../eslint/match-import');

  it('parses import statements', function() {
    expect(matchImport()).to.eql(null);
    expect(matchImport('')).to.eql(null);
    expect(matchImport('#import "./someFragment.graphql"')).to.eql({ importIdentifier: './someFragment.graphql'});
    expect(matchImport(`#import './someFragment.graphql'`)).to.eql({ importIdentifier: './someFragment.graphql'});
    expect(matchImport('import "./someFragment.graphql"')).to.eql(null);
    expect(matchImport(`#import './someFragment.graphql"`)).to.eql(null);
    expect(matchImport('#import ./someFragment.graphql"')).to.eql(null);
    expect(matchImport('#import "./someFragment.graphql')).to.eql(null);
  });

  it('works', function() {
    expect(parseImports('')).to.eql([]);
    expect(parseImports('#import "_foo.graphql"')).to.eql([
      {
        type: 'CommentImportStatement',
        name: {
          type: 'Name',
          value: '_foo.graphql',
          loc: {
            start: {
              line: 1,
              column: 9,
            },
            end: {
              line: 1,
              column: 21
            }
          },
          comments: [],
          range: [9, 21],
          tokens: []
        }
      }
    ]);

    expect(parseImports(`#import "_foo.graphql"
#import "_bar.graphql"`)).to.eql([
      {
        type: 'CommentImportStatement',
        name: {
          type: 'Name',
          value: '_foo.graphql',
          loc: {
            start: {
              line: 1,
              column: 9,
            },
            end: {
              line: 1,
              column: 21
            }
          },
          comments: [],
          range: [9, 21],
          tokens: []
        }
      },
      {
        type: 'CommentImportStatement',
        name: {
          type: 'Name',
          value: '_bar.graphql',
          loc: {
            start: {
              line: 2,
              column: 9,
            },
            end: {
              line: 2,
              column: 21
            }
          },
          comments: [],
          range: [32, 44],
          tokens: []
        }
      }
    ]);
  });
});
