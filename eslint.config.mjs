import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      'no-console': 'warn',
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      curly: 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
      camelcase: ['error', { properties: 'always' }],
      'comma-dangle': ['error', 'always-multiline'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended', 'prettier'],
  },
  pluginJs.configs.recommended,
];
