import config from '@evalore/prettier-config';

export default {
  ...config,
  htmlWhitespaceSensitivity: 'ignore',
  objectWrap: 'preserve',
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};
