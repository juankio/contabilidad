import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  components: [
    { path: 'app/components', pathPrefix: false }
  ],

  imports: {
    dirs: [
      'app/composables/**'
    ]
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  runtimeConfig: {
    mongoUri: process.env.MONGO_URI || '',
    authSecret: process.env.AUTH_SECRET || '',
    authCookieName: process.env.AUTH_COOKIE_NAME || 'contabilidad_auth',
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFrom: process.env.RESEND_FROM || '',
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || ''
    }
  },

  routeRules: process.env.NUXT_PRERENDER === 'true'
    ? { '/': { prerender: true } }
    : {
        '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
        '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } },
        '/api/**': { cors: true }
      },

  compatibilityDate: '2025-01-15',
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
