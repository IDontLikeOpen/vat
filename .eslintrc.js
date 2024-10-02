// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: [
    'eslint:recommended',
    // https://eslint.vuejs.org/user-guide/
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'no-undef': 'off',
    'no-debugger': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'vue/no-v-html': 'off',
  },
};
