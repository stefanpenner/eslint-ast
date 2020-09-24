'use strict';

const { expect } = require('chai');
const parser = require('../parser');

describe('parser', function () {
  it('looks about right', function () {
    expect(parser.parseForESLint).to.be.a('function');
  });

  // TODO: does eslint let us inform it of where in the file the error may have occurred while parsing?
  it('provides a good error if graphql could not parse', function () {
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
      parser.parseForESLint('random content{', {
        filePath: 'some-file.graphql',
      });
    }).to.throw(/Could not parse file: some-file.graphql/);

    expect(() => {
      parser.parseForESLint('random content{');
    }).to.throw(/File Contents:\n random content{\n$/);
  });

  it('throws a useful error if options.schema cannot be found', function () {
    expect(() => {
      parser.parseForESLint('query { foo { __typename } }', {
        schema: '/probably/not/a/real/path.graphql',
      });
    }).to.throw(/ENOENT.*not\/a\/real\/path.graphql/);
  });

  it('throws a useful error if options.schema is relative', function () {
    expect(() => {
      parser.parseForESLint('query { foo { __typename } }', {
        schema: './no/such/path.graphql',
      });
    }).to.throw(/must be an absolute path.*__dirname/i);
  });

  it('produces reasonable output', function () {
    // we will rely on other more unit tests, or integration tests to ensure the actual complexity is tests
    const result = parser.parseForESLint('fragment apple on Fruit { id }', {
      filePath: 'some-file.graphql',
    });
    expect(result).to.have.keys(['ast', 'scopeManager', 'visitorKeys', 'services']);
  });

  describe('parser services', function () {
    it('has a functioning parse method', function () {
      const source = `
query {
  id
}
      `;
      const result = parser.parseForESLint(source);
      expect(result.services.parse(source)).to.deep.eql(result.ast);
    });

    it('has a functioning correspondingNode method', function () {
      const result = parser.parseForESLint(`
query {
  id
}
`);

      const eslintNode = result.ast;
      expect(eslintNode).to.be.an('object');
      const gqlNode = result.services.correspondingNode(eslintNode);
      expect(eslintNode).to.not.eql(gqlNode);

      expect(result.services.correspondingNode(eslintNode)).to.eql(gqlNode);
      expect(result.services.correspondingNode(gqlNode)).to.eql(eslintNode);
    });

    it('has a functioning getFragmentDefinitionsFromSource method', function () {
      const result = parser.parseForESLint(`
query {
  id
}
`);

      const source = `
fragment Foo on Object {
  id
  name
}
fragment Bar on Object {
  id
}`;
      expect(
        result.services
          .getFragmentDefinitionsFromSource(source)
          .map(node => ({ type: node.type, name: node.name.value })),
      ).to.deep.eql([
        { type: 'FragmentDefinition', name: 'Foo' },
        { type: 'FragmentDefinition', name: 'Bar' },
      ]);

      const fragments = result.services.getFragmentDefinitionsFromSource(source);
      const eslintNode = fragments[0];
      const gqlNode = result.services.correspondingNode(eslintNode);

      expect(eslintNode).to.have.property('type', 'FragmentDefinition');

      expect(gqlNode).to.have.property('kind', 'FragmentDefinition');

      expect(gqlNode).to.not.eql(eslintNode);
    });
  });

  it('has a functioning createTypeInfo', function () {
    const result = parser.parseForESLint(`
query {
  id
}`);

    const typeInfo = result.services.createTypeInfo();
    expect(typeInfo).to.be.instanceof(require('graphql').TypeInfo);
  });
});
