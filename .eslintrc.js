module.exports = {
    root: true,
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'prettier/@typescript-eslint',
    ],
  
    plugins: [
      '@typescript-eslint',
    ],
    parserOptions: {
      parser: '@typescript-eslint/parser',
      sourceType: 'module',
      project: './tsconfig.json',
    },
    env: {
      node: true
    },
    rules: {
      'prefer-promise-reject-errors': 'off',
      quotes: ['warn', 'single'],
      '@typescript-eslint/indent': ['warn', 2],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "@typescript-eslint/no-explicit-any": 'off'
    }
  }
  