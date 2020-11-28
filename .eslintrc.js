module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
  ],
  // add your custom rules here
  rules: {
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never',
    }],
    'comma-dangle': ['error', 'always-multiline'],
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
  },
  globals: {
    _: true,
  },
}
