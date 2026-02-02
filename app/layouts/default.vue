<script setup>
const route = useRoute()
const showHeader = computed(() => !['/login', '/profiles'].includes(route.path))
const isMobileMenuOpen = ref(false)

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  }
)
</script>

<template>
  <div>
    <UHeader
      v-if="showHeader"
      class="border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur"
      :toggle="false"
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
          class="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 sm:hidden"
          type="button"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav"
          :aria-label="isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg
            v-if="!isMobileMenuOpen"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
            />
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
            />
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
            />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            />
          </svg>
        </button>
        <nav class="hidden items-center gap-3 text-sm sm:flex">
          <NuxtLink
            to="/"
            class="text-slate-600 hover:text-slate-900"
            exact-active-class="text-slate-900 font-semibold"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/gastos"
            class="text-slate-600 hover:text-slate-900"
            exact-active-class="text-slate-900 font-semibold"
          >
            Gastos
          </NuxtLink>
          <NuxtLink
            to="/reportes"
            class="text-slate-600 hover:text-slate-900"
            exact-active-class="text-slate-900 font-semibold"
          >
            Reportes
          </NuxtLink>
        </nav>
      </template>
    </UHeader>

    <div
      v-if="showHeader && isMobileMenuOpen"
      id="mobile-nav"
      class="border-b border-slate-200 bg-white sm:hidden"
    >
      <nav class="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-sm">
        <NuxtLink
          to="/"
          class="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          exact-active-class="bg-slate-100 text-slate-900 font-semibold"
        >
          Inicio
        </NuxtLink>
        <NuxtLink
          to="/gastos"
          class="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          exact-active-class="bg-slate-100 text-slate-900 font-semibold"
        >
          Gastos
        </NuxtLink>
        <NuxtLink
          to="/reportes"
          class="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          exact-active-class="bg-slate-100 text-slate-900 font-semibold"
        >
          Reportes
        </NuxtLink>
      </nav>
    </div>

    <main class="min-h-screen">
      <slot />
    </main>
  </div>
</template>
