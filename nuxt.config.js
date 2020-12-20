import webpack from 'webpack'
const { npm_package_name: title, npm_package_description: description, npm_package_version: version } = process.env

export default {
  /*
  ** Headers of the page
  */
  head: {
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
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
    {
      src: '~/plugins/helper',
    },
    {
      src: '~/plugins/vue-lodash',
    },
    {
      src: '~/plugins/vue-json-viewer',
      mode: 'client',
    },
    {
      src: '~/plugins/vue-clamp',
      mode: 'client',
    },
    {
      src: '~/plugins/vue-perfect-scrollbar',
    },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/fontawesome',
    '@nuxtjs/svg',
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
    '@nuxtjs/sentry',
    '@nuxtjs/style-resources',
    '@nuxtjs/dayjs',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  sentry: {
    dsn: 'https://3589ac1a901244449ceb1d323fcba7c7@o427785.ingest.sentry.io/5401003',
  },
  dayjs: {
    locales: ['zh-tw'],
    defaultLocale: 'zh-tw',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone', // import 'dayjs/plugin/timezone'
    ],
  },
  fontawesome: {
    icons: {
      solid: true,
    },
  },
  stylelint: {
    fix: true,
  },
  eslint: {
    fix: true,
  },
  styleResources: {
    scss: [
      'bootstrap/scss/_functions.scss',
      'bootstrap/scss/_variables.scss',
      'bootstrap/scss/_mixins.scss',
      'bootstrap-vue/src/_variables.scss',
    ],
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
      video: ({ isDev }) => (isDev ? `[path][name].v${version}.[ext]` : `videos/[hash:7].v${version}.[ext]`),
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
      }),
    ],
    transpile: ['vue-clamp', 'resize-detector'],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
  },
  env: {
    API_URL: process.env.API_URL,
    API_VERSION: process.env.API_VERSION,
  },
  components: true,
  modern: true,
  telemetry: true,
}
