import tseslint from 'typescript-eslint';
import unicornEslintPlugin from 'eslint-plugin-unicorn';
import { configs } from '@evalore/eslint-config';

export default tseslint.config(
  configs.js,
  unicornEslintPlugin.configs.recommended,
  configs.ts,
  configs.angularTemplate,
  configs.angular,
  {
    files: ['**/*.ts'],
    rules: {
      /**
       * validatorFn requires to return ValidationErrors | null
       */
      'unicorn/no-null': 'off',
    },
  },
);
