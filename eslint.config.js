// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Apaga las reglas de ESLint que interfieren con Prettier
  eslintConfigPrettier,
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**'],
  },
  storybook.configs['flat/recommended'],
);
