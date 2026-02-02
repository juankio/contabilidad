<script setup>
const route = useRoute()
const showHeader = computed(() => !['/login', '/profiles'].includes(route.path))
</script>

<template>
  <div>
    <UHeader
      v-if="showHeader"
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

    <main class="min-h-screen">
      <slot />
    </main>
  </div>
</template>
