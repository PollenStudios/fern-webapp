module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: ['plugin:react/recommended', 'airbnb', 'airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'object-curly-newline': 'off',
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    quotes: [2, 'double', { avoidEscape: true }],
    '@typescript-eslint/quotes': [1, 'double'],
    // Disable Required Import for React as React 18 doesn't require explicit import.
    'react/react-in-jsx-scope': 'off',
    'max-len': ['error', { code: 120 }],
    'react/jsx-wrap-multilines': 'off',
  },
}
