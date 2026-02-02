// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  runtimeConfig: {
    mongoUri: process.env.MONGO_URI || ''
  },

  routeRules: process.env.NUXT_PRERENDER === 'true'
    ? { '/': { prerender: true } }
    : {},

  compatibilityDate: '2025-01-15',
  nitro: { preset: 'vercel' },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
