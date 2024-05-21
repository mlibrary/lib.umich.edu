import globals from "globals";
//import { fixupConfigRules } from '@eslint/compat';
import stylistic from '@stylistic/eslint-plugin';
import pluginJs from "@eslint/js";
import react from 'eslint-plugin-react';

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
       parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
    },
    plugins: {
      '@stylistic': stylistic,
      react,
    },
    rules: {
      ...pluginJs.configs.all.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    }
  },
  stylistic.configs['recommended-flat'],
  pluginJs.configs.recommended,
];
