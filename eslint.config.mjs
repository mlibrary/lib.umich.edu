import globals from 'globals';
import { fixupConfigRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

export default [
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    plugins: {
      '@stylistic': stylistic
    }
  },
  ...fixupConfigRules(pluginReactConfig),
  stylistic.configs['recommended-flat'],
  {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/spaced-comment': ['error', 'always', { block: { balanced: true } }],
      ...pluginJs.configs.all.rules,
      'arrow-body-style': ['error', 'always'],
      complexity: 'off',
      'default-param-last': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      'one-var': ['error', { initialized: 'never' }],
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'sort-imports': ['error', { ignoreCase: true }]
    }
  }
];
