<script setup>
import { buildThemeInitScript } from '~/composables/useTheme'

const { initTheme } = useTheme()
onMounted(() => initTheme())

useHead({
  script: [{ innerHTML: buildThemeInitScript(), tagPosition: 'head' }],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'apple-touch-icon', href: '/icon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Control de ingresos y gastos'
const description = 'App simple para registrar ingresos, gastos, ver balance mensual y exportar reportes a Excel.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const colorMode = useColorMode()
colorMode.preference = 'light'
</script>

<template>
  <NuxtLoadingIndicator
    color="var(--brand-500)"
    :height="4"
  />
  <UApp>
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
  </UApp>
</template>

<style>
/* Estilos Globales FinTech Glassmorphism */
body {
  background-color: #f8fafc;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
  background-blend-mode: multiply;
}

.fintech-bg {
  /* Ensure it has a transparent background to let the body show through, or apply noise here directly */
  background-color: transparent !important;
}
</style>
