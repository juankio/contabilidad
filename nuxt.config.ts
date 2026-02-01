// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: { preset: 'vercel' },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  css: ['~/assets/css/main.css'],

  devtools: {
    enabled: true
  },

  routeRules: {
    '/': { prerender: true }
  },

  runtimeConfig: {
    mongoUri: process.env.MONGO_URI || ''
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
