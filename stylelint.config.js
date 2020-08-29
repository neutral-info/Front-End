module.exports = {
  extends: 'stylelint-config-recommended-scss',
  plugins: [
    'stylelint-selector-bem-pattern'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'no-descending-specificity': null
  }
}
