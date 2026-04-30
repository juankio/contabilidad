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
  background-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjAwIDIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdub2lzZUZpbHRlcic+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuODUnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbm9pc2VGaWx0ZXIpJyBvcGFjaXR5PScwLjA4Jy8+PC9zdmc+");
  background-blend-mode: multiply;
}

.fintech-bg {
  /* Ensure it has a transparent background to let the body show through, or apply noise here directly */
  background-color: transparent !important;
}
</style>
