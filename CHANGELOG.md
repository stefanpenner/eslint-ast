## v1.0.5 (2021-03-23)

#### :bug: Bug Fix
* [#19](https://github.com/stefanpenner/eslint-ast/pull/19) fix(parser): pathOf handle fragments with no condition ([@spham92](https://github.com/spham92))

#### Committers: 2
- David J. Hamilton ([@hjdivad](https://github.com/hjdivad))
- Steven Pham ([@spham92](https://github.com/spham92))

## v1.0.4 (2020-10-01)

### :rocket: Enhancement
* Throw if options.schema is missing [#16](https://github.com/stefanpenner/eslint-ast/pull/16)

### :bug: Bug Fix
* Fix typeInfo ordering  [#17](https://github.com/stefanpenner/eslint-ast/pull/17)

#### Committers: 1
- David J. Hamilton ([@hjdivad](https://github.com/hjdivad))

## v1.0.3 (2020-09-24)

### :rocket: Enhancement
* `parserServices.pathOf`  Add a utility for getting a user-friendly name of a path to a node.

### :bug: Bug Fix
* Fix typeInfo type stack bug (previously type stack was only being written to)

#### Committers: 1
- David J. Hamilton ([@hjdivad](https://github.com/hjdivad))

## v1.0.2 (2020-09-24)

### :rocket: Enhancement
* `parserServices.createTypeInfo` allow creation of a `TypeInfo` from parser services, ensuring that rules use a common `graphql` instance.

#### Committers: 2
- David J. Hamilton ([@hjdivad](https://github.com/hjdivad))
- Stefan Penner ([@stefanpenner](https://github.com/stefanpenner))
