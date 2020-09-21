'use strict';

const memoizedBuildSchema = require('../lib/memoized-build-schema');
const { expect } = require('chai');

describe('memoized-build-schema', function () {
  it('identity of schema is based on content of the schemaString', function () {
    const schema1 = memoizedBuildSchema(`
type Apple {
  id: String!
}`);

    const schema2 = memoizedBuildSchema(`
type Apple {
  id: String!
}`);

    const schema3 = memoizedBuildSchema(`
# comment
type Apple {
  id: String!
}`);

    expect(schema1).to.equal(schema2);
    expect(schema1).to.not.equal(schema3);
    expect(schema2).to.not.equal(schema3);
  });
  it('has a clearable cache', function () {
    const SCHEMA = `
type Apple {
  id: String!
}`;
    const schema1 = memoizedBuildSchema(SCHEMA);
    const schema2 = memoizedBuildSchema(SCHEMA);

    memoizedBuildSchema.clear();

    const schema3 = memoizedBuildSchema(SCHEMA);
    const schema4 = memoizedBuildSchema(SCHEMA);

    expect(schema1).to.equal(schema2);
    expect(schema3).to.equal(schema4);
    expect(schema1).to.not.equal(schema3);
    expect(schema1).to.not.equal(schema4);
  });
});
