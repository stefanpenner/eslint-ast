const tester = require('./rule-tester');

const plugin = require('../../eslint/index');
/*
 *
 * Here we smoke test the following graphql validations, to ensure our adapter works
 *
 * ExecutableDefinitionsRule
 * UniqueOperationNamesRule
 * LoneAnonymousOperationRule
 * SingleFieldSubscriptionsRule
 * KnownTypeNamesRule
 * FragmentsOnCompositeTypesRule
 * VariablesAreInputTypesRule
 * ScalarLeafsRule
 * FieldsOnCorrectTypeRule
 * UniqueFragmentNamesRule
 * KnownFragmentNamesRule
 * NoUnusedFragmentsRule
 * PossibleFragmentSpreadsRule
 * NoFragmentCyclesRule
 * UniqueVariableNamesRule
 * NoUndefinedVariablesRule
 * NoUnusedVariablesRule
 * KnownDirectivesRule
 * UniqueDirectivesPerLocationRule
 * KnownArgumentNamesRule
 * UniqueArgumentNamesRule
 * ValuesOfCorrectTypeRule
 * ProvidedRequiredArgumentsRule
 * VariablesInAllowedPositionRule
 * OverlappingFieldsCanBeMergedRule
 * UniqueInputFieldNamesRule
*/

tester.run('ExecutableDefinitionsRule', plugin.rules.ExecutableDefinitionsRule, {
  valid: [
    `fragment Foo on Apple { id }`
  ],
  invalid: [
    {
      code: `type User { id: String! }`,
      errors: [
        {
          type: 'ObjectTypeDefinition',
          message: 'The "User" definition is not executable.',
          column: 2,
          endColumn: 26,
          endLine: 1,
          line: 1,
        }
      ]
    }
  ]
});

tester.run('UniqueOperationNamesRule', plugin.rules.UniqueOperationNamesRule, {
  valid: [
    `query { id }`,
    `
query { id }
query a { id }
query b { id }
`
  ],
  invalid: [
    {
      code: `
query a { id }
query a { id }
      `,
      errors: [
        {
          type: 'Name',
          message: 'There can be only one operation named "a".',
          column: 8,
          endColumn: 8,
          endLine: 2,
          line: 2,
        }
      ]
    },
  ]
});

tester.run('LoneAnonymousOperationRule', plugin.rules.LoneAnonymousOperationRule, {
  valid: [
    `query { id }`,
  ],
  invalid: [
    {
      code: `
query { id }
query { id }
`,
      errors: [
        {
          message: 'This anonymous operation must be the only defined operation.',
          line: 2,
          column: 2,
          type: 'OperationDefinition',
          endLine: 2,
          endColumn: 13
        },
        {
          message: 'This anonymous operation must be the only defined operation.',
          line: 3,
          column: 2,
          type: 'OperationDefinition',
          endLine: 3,
          endColumn: 13
        }

      ]
    },
  ]
});

tester.run('SingleFieldSubscriptionsRule', plugin.rules.SingleFieldSubscriptionsRule, {
  valid: [
    `subscription { id }`,
  ],
  invalid: [
    {
      code: `subscription { id, name }`,
      errors: [
        {
          type: 'Field',
          message: 'Anonymous Subscription must select only one top level field.',
          column: 21,
          endColumn: 21,
          endLine: 1,
          line: 1,
        }
      ]
    },
  ]
});

tester.run('KnownTypeNamesRule', plugin.rules.KnownTypeNamesRule, {
  valid: [
    {
      code: `
query Foo(
  $var: String
  $required: [Int!]!
  $introspectionType: __EnumValue
) {
  user(id: 4) {
    fruits { ... on Fruit { name }, ...FruitFields, ... { name } }
  }
}
fragment FruitFields on Fruit {
  name
}
`,
    }
  ],
  invalid: [
    {
      code: `
query Foo($var: JumbledUpLetters) {
  user(id: 4) {
    name
    pets { ... on Veggies { name }, ...FruitFields }
  }
}
fragment FruitFields on Fruiiiit {
  name
}
      `,
      errors: [
        {
          type: 'NamedType',
          message: 'Unknown type "Veggies".',
          column: 20,
          endColumn: 20,
          endLine: 5,
          line: 5,
        },
{
          type: 'NamedType',
          message: 'Unknown type "Fruiiiit". Did you mean "Fruit"?',
          column: 26,
          endColumn: 26,
          endLine: 8,
          line: 8,
        }

      ]
    },
  ]
});

tester.run('FragmentsOnCompositeTypesRule', plugin.rules.FragmentsOnCompositeTypesRule, {
  valid: [
    {
      code: `
fragment validFragment on Pet {
  ... {
    name
  }
}
`,
    }
  ],
  invalid: [
    {
      code: `
fragment scalarFragment on Boolean {
  bad
}
      `,
      errors: [
        {
          type: 'NamedType',
          message: 'Fragment "scalarFragment" cannot condition on non composite type "Boolean".',
          column: 29,
          endColumn: 29,
          endLine: 2,
          line: 2,
        },
      ]
    }
  ]
});

tester.run('VariablesAreInputTypesRule', plugin.rules.VariablesAreInputTypesRule, {
  valid: [
    {
      code: `
query Foo($a: String, $b: [Boolean!]!, $c: ComplexInput) {
  field(a: $a, b: $b, c: $c)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
query Foo($a: Dog, $b: [[CatOrDog!]]!, $c: Pet) {
  field(a: $a, b: $b, c: $c)
}
      `,
      errors: [
        {
          message: 'Variable "$a" cannot be non-input type "Dog".',
          line: 2,
          column: 16,
          type: 'NamedType',
          endLine: 2,
          endColumn: 16
        },
        {
          message: 'Variable "$b" cannot be non-input type "[[CatOrDog!]]!".',
          line: 2,
          column: 25,
          type: 'NonNullType',
          endLine: 2,
          endColumn: 38
        },
        {
          message: 'Variable "$c" cannot be non-input type "Pet".',
          line: 2,
          column: 45,
          type: 'NamedType',
          endLine: 2,
          endColumn: 45
        }
      ]
    }
  ]
});

tester.run('ScalarLeafsRule', plugin.rules.ScalarLeafsRule, {
  valid: [
    {
      code: `
fragment scalarSelection on Dog {
  barks
}
      `,
    }
  ],
  invalid: [
    {
      code: `{ human { pets } }`,
      errors: [
        {
          type: 'Field',
          message: 'Field "pets" of type "[Pet]" must have a selection of subfields. Did you mean "pets { ... }"?',
          column: 12,
          endColumn: 12,
          endLine: 1,
          line: 1,
        },
      ]
    }
  ]
});

tester.run('FieldsOnCorrectTypeRule', plugin.rules.FieldsOnCorrectTypeRule, {
  valid: [
    {
      code: `
fragment objectFieldSelection on Dog {
  __typename
  name
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment fieldNotDefined on Dog {
  meowVolume
}
      `,
      errors: [
        {
          type: 'Field',
          message: 'Cannot query field "meowVolume" on type "Dog". Did you mean "barkVolume"?',
          column: 4,
          endColumn: 4,
          endLine: 3,
          line: 3,
        },
      ]
    }
  ]
});

tester.run('UniqueFragmentNamesRule', plugin.rules.UniqueFragmentNamesRule, {
  valid: [
    {
      code: `
fragment  a on Dog {
  name
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment A on Dog {
  name
}

fragment A on Dog {
  name
}
      `,
      errors: [
        {
          type: 'Name',
          message: 'There can be only one fragment named "A".',
          column: 11,
          endColumn: 11,
          endLine: 2,
          line: 2,
        },
      ]
    }
  ]
});

tester.run('KnownFragmentNamesRule', plugin.rules.KnownFragmentNamesRule, {
  valid: [
    {
      code: `
fragment A on Dog {
  name
}
query {
  a
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment A on Dog {
  name
  ...B
}
      `,
      errors: [
        {
          type: 'Name',
          message: 'Unknown fragment "B".',
          column: 7,
          endColumn: 7,
          endLine: 4,
          line: 4,
        },
      ]
    }
  ]
});


tester.run('NoUnusedFragmentsRule', plugin.rules.NoUnusedFragmentsRule, {
  valid: [
    {
      code: `
fragment A on Dog {
  name
}
query {
  ...A
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment A on Dog {
  name
}
      `,
      errors: [
        {
          type: 'FragmentDefinition',
          message: 'Fragment "A" is never used.',
          column: 2,
          endColumn: 2,
          endLine: 4,
          line: 2,
        },
      ]
    }
  ]
});

tester.run('PossibleFragmentSpreadsRule', plugin.rules.PossibleFragmentSpreadsRule, {
  valid: [
    {
      code: `
fragment  A on Dog{
  ... on Dog { barkVolume }
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment  A on Cat {
  ... on Dog { barkVolume }
}
      `,
      errors: [
        {
          type: 'InlineFragment',
          message: 'Fragment cannot be spread here as objects of type "Cat" can never be of type "Dog".',
          column: 4,
          endColumn: 28,
          endLine: 3,
          line: 3,
        },
      ]
    }
  ]
});

tester.run('NoFragmentCyclesRule', plugin.rules.NoFragmentCyclesRule, {
  valid: [
    {
      code: `
fragment A on Dog {
  barkVolume
}
fragment B on Dog {
  barkVolume
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment A on Dog {
  ...B
}
fragment B on Dog {
  ...C
}
fragment C on Dog {
  ...A
}
      `,
      errors: [
        {
          type: 'FragmentSpread',
          message: 'Cannot spread fragment "A" within itself via "B", "C".',
          column: 4,
          endColumn: 7,
          endLine: 3,
          line: 3,
        },
      ]
    }
  ]
});

tester.run('UniqueVariableNamesRule', plugin.rules.UniqueVariableNamesRule, {
  valid: [
    {
      code: `
query Foo($a: String, $b: String) {
  field(a: $a, b: $b)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
query Foo($a: String, $a: String) {
  field(a: $a)
}
      `,
      errors: [
        {
          type: 'Name',
          message: 'There can be only one variable named "$a".',
          column: 13,
          endColumn: 13,
          endLine: 2,
          line: 2,
        },
      ]
    }
  ]
});

tester.run('NoUndefinedVariablesRule', plugin.rules.NoUndefinedVariablesRule, {
  valid: [
    {
      code: `
query Foo($a: String) {
  field(a: $a)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  field(a: $a)
}
      `,
      errors: [
        {
          type: 'Variable',
          message: 'Variable "$a" is not defined.',
          column: 13,
          endColumn: 14,
          endLine: 3,
          line: 3,
        },
      ]
    }
  ]
});

tester.run('NoUnusedVariablesRule', plugin.rules.NoUnusedVariablesRule, {
  valid: [
    {
      code: `
query Foo($a: String) {
  field(a: $a)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
query Foo($a: String, $b: String) {
  field(a: $a)
}
      `,
      errors: [
        {
          type: 'VariableDefinition',
          message: 'Variable "$b" is never used in operation "Foo".',
          column: 24,
          endColumn: 28,
          endLine: 2,
          line: 2,
        },
      ]
    }
  ]
});

tester.run('KnownDirectivesRule', plugin.rules.KnownDirectivesRule, {
  valid: [
    {
      code: `
{
  dog @include(if: true) {
    name
  }
  human @skip(if: false) {
    name
  }
}
      `,
    }
  ],
  invalid: [
    {
      code: `
 {
   dog @unknown(directive: "value") {
     name
   }
 }
      `,
      errors: [
        {
          type: 'Directive',
          message: 'Unknown directive "@unknown".',
          column: 9,
          endColumn: 36,
          endLine: 3,
          line: 3,
        },
      ]
    }
  ]
});

tester.run('UniqueDirectivesPerLocationRule', plugin.rules.UniqueDirectivesPerLocationRule, {
  valid: [
    {
      code: `
{
  dog @include(if: true) {
    name
  }
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  dog @include(if: true) @include(if: true) {
    name @directive @directive
  }
}
      `,
      errors: [
        {
          message: 'The directive "@include" can only be used once at this location.'
        }
      ]
    }
  ]
});

tester.run('KnownArgumentNamesRule', plugin.rules.KnownArgumentNamesRule, {
  valid: [
    {
      code: `
{
  dog @onField
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  dog @onField(if: true)
}
      `,
      errors: [
        {
          message: 'Unknown argument "if" on directive "@onField".',
          line: 3,
          column: 17,
          type: 'Argument',
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'Unknown argument "if" on field "QueryRoot.dog".',
          line: 3,
          column: 17,
          type: 'Argument',
          endLine: 3,
          endColumn: 21
        }
      ]
    }
  ]
});

tester.run('UniqueArgumentNamesRule', plugin.rules.UniqueArgumentNamesRule, {
  valid: [
    {
      code: `
{
  dog @skip(if: true)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  dog @skip(if: true, if: false)
}
      `,
      errors: [
        {
          message: 'There can be only one argument named "if".',
          line: 3,
          column: 14,
          type: 'Name',
          endLine: 3,
          endColumn: 14
        }

      ]
    }
  ]
});

tester.run('ValuesOfCorrectTypeRule', plugin.rules.ValuesOfCorrectTypeRule, {
  valid: [
    {
      code: `
{
  dog @skip(if: true)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  dog @skip(if: 1.0)
}
      `,
      errors: [
        {
          message: 'Boolean cannot represent a non boolean value: 1.0',
          line: 3,
          column: 18,
          type: 'FloatValue',
          endLine: 3,
          endColumn: 18
        }

      ]
    }
  ]
});

tester.run('ProvidedRequiredArgumentsRule', plugin.rules.ProvidedRequiredArgumentsRule, {
  valid: [
    {
      code: `
{
  dog @skip(if: true)
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  dog @skip
}
      `,
      errors: [
        {
          message: 'Directive "@skip" argument "if" of type "Boolean!" is required, but it was not provided.',
          line: 3,
          column: 8,
          type: 'Directive',
          endLine: 3,
          endColumn: 9
        }

      ]
    }
  ]
});

tester.run('VariablesInAllowedPositionRule', plugin.rules.VariablesInAllowedPositionRule, {
  valid: [
    {
      code: `
fragment Fragment on ComplicatedArgs {
  nonNullIntArgField(nonNullIntArg: $intArg)
}

query Query($intArg: Int!) {
  complicatedArgs {
    ...Fragment
  }
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment Fragment on ComplicatedArgs {
  nonNullIntArgField(nonNullIntArg: $intArg)
}

query Query($intArg: Int) {
  complicatedArgs {
    ...Fragment
  }
}
    `,
      errors: [
        {
          message: 'Variable "$intArg" of type "Int" used in position expecting type "Int!".',
          line: 6,
          column: 14,
          type: 'VariableDefinition',
          endLine: 6,
          endColumn: 23
        }

      ]
    }
  ]
});

tester.run('OverlappingFieldsCanBeMergedRule', plugin.rules.OverlappingFieldsCanBeMergedRule, {
  valid: [
    {
      code: `
fragment Fragment on Dog {
  nom: name
  nom: name
}
      `,
    }
  ],
  invalid: [
    {
      code: `
fragment Fragment on Dog {
  nom: name
  nom: nickname
}
      `,
      errors: [
        {
          message: 'Fields "nom" conflict because "name" and "nickname" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
          line: 3,
          column: 4,
          type: 'Field',
          endLine: 3,
          endColumn: 9
        }

      ]
    }
  ]
});

tester.run('UniqueInputFieldNamesRule', plugin.rules.UniqueInputFieldNamesRule, {
  valid: [
    {
      code: `
{
  field(arg: { f1: "value", f2: "value" })
}
      `,
    }
  ],
  invalid: [
    {
      code: `
{
  field(arg: { f1: "value", f1: "value" })
}
      `,
      errors: [
        {
          message: 'There can be only one input field named "f1".',
          line: 3,
          column: 17,
          type: 'Name',
          endLine: 3,
          endColumn: 17
        }

      ]
    }
  ]
});

