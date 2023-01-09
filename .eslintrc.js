const fs = require('fs')
const path = require('path')

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'))

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app', 'eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['./node_modules'],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {'prettier/prettier': ['warn', prettierOptions]},
    },
  ],
}
