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
       * doesn't follow the new angular naming convention
       * see https://angular.dev/style-guide#naming
       */
      '@angular-eslint/component-class-suffix': 'off',
    },
  },
);
