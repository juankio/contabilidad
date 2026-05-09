import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components/features', pathPrefix: false },
    { path: '~/components/auth', pathPrefix: false },
    { path: '~/components', pathPrefix: false }
  ],

  imports: {
    dirs: [
      'composables/**',
      'stores/**'
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

  spaLoadingTemplate: 'spa-loading-template.html',

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
        '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } },
        '/api/**': { cors: true },
        '/**': {
          headers: {
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
            'Referrer-Policy': 'no-referrer-when-downgrade'
          }
        }
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
