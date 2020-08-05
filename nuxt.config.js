const { npm_package_name: title, npm_package_description: description, npm_package_version: version } = process.env

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/sentry'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  sentry: {
    dsn: '', // Enter your project's DSN here
    config: {} // Additional config
  },
  /*
  ** Build configuration
  */
  build: {
    cache: true,
    hardSource: true,
    parallel: true,
    filenames: {
      app: ({ isDev, isModern }) => (isDev ? (isModern ? `modern-[name].v${version}.js` : `[name].v${version}.js`) : (isModern ? `modern-[chunkhash].v${version}.js` : `[chunkhash].v${version}.js`)),
      chunk: ({ isDev, isModern }) => (isDev ? (isModern ? `modern-[name].v${version}.js` : `[name].v${version}.js`) : (isModern ? `modern-[id].[chunkhash].v${version}.js` : `[id].[chunkhash].v${version}.js`)),
      css: ({ isDev }) => (isDev ? `[name].v${version}.js` : `[contenthash].v${version}.css`),
      img: ({ isDev }) => (isDev ? `[path][name].v${version}.[ext]` : `img/[hash:7].v${version}.[ext]`),
      font: ({ isDev }) => (isDev ? `[path][name].v${version}.[ext]` : `fonts/[hash:7].v${version}.[ext]`),
      video: ({ isDev }) => (isDev ? `[path][name].v${version}.[ext]` : `videos/[hash:7].v${version}.[ext]`)
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  components: true,
  modern: true,
  telemetry: true
}
