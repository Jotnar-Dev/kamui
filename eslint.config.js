// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier, // Apaga las reglas de ESLint que interfieren con Prettier
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
);
