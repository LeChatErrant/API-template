module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['import', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
  },
  rules: {
    // Import order
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'import/order': ['error', {
      'newlines-between': 'always',
      'groups': [
        ['builtin', 'external'],
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'pathGroups': [
        {
          'pattern': '@{root,services,middlewares,routes,utils}/**',
          'group': 'external',
          'position': 'after',
        },
      ],
      'pathGroupsExcludedImportTypes': ['builtin'],
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true,
      },
    }],
    'import/newline-after-import': ['error', { 'count': 1/*, 'considerComments': true */ }],
    'import/first': 'error',
    'import/no-duplicates': 'error',

    // Unused imports
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' },
    ],

    // Misc rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'eol-last': 2,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': ['error'],
    'max-classes-per-file': 'off',
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  },
};
