'use strict';
const { expect } = require('chai');

describe('graphql-eslint plugin', function() {
  const plugin = require('../eslint/');

  it('has expected rules', function() {
    expect(plugin.rules['example-rule']).to.be.a('object');
  });

  it('has the expected members', function() {
    expect(plugin).to.have.keys([
      'rules',
      'meta',
      'create'
    ]);
    expect(plugin.rules).to.be.a('object');
    expect(plugin.meta).to.be.a('object');
    expect(plugin.create).to.be.a('function');
  })
});
