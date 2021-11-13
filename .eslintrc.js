module.exports = {
  root: true,
  env: {
    browser: true,
    // 'es2021': true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    // 'eslint:recommended',
    // 'google',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'max-len': ['error', {
    //   code: 130,
    // }],
    indent: ['error', 2],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],

    // remove later

    "no-case-declarations": "off",
    "brace-style": "off",
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
