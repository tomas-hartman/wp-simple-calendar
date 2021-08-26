module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
  ],
  'rules': {
    'max-len': ['error', {
      'code': 130,
    }],
    'indent': ['error', 2],
  },
};
