<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
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
  <UApp>
    <UHeader
      class="border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur"
    >
      <template #left>
        <NuxtLink
          to="/"
          class="text-base font-semibold text-slate-900"
        >
          Mi Contabilidad
        </NuxtLink>
      </template>

      <template #right>
        <button
          class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 sm:hidden"
        >
          Menu
        </button>
        <nav class="hidden items-center gap-3 text-sm sm:flex">
          <NuxtLink
            to="/"
            class="text-slate-600 hover:text-slate-900"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/gastos"
            class="text-slate-600 hover:text-slate-900"
          >
            Gastos
          </NuxtLink>
          <NuxtLink
            to="/reportes"
            class="text-slate-600 hover:text-slate-900"
          >
            Reportes
          </NuxtLink>
        </nav>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
