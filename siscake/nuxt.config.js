export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Interhubx',
    htmlAttrs: {
      lang: 'pt-BR'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Interhubx - App' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Icons' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  bootstrapVue: {

    componentPlugins: [
      'IconsPlugin',
      'FormPlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'ButtonPlugin',
      'ToastPlugin',
      'NavbarPlugin',
      'AvatarPlugin',
      'TabsPlugin',
      'ModalPlugin',
      'FormSelectPlugin',
      'PopoverPlugin',
      'PaginationPlugin',
      'TablePlugin'
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3001/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
