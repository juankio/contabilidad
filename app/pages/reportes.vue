<script setup lang="ts">
definePageMeta({
  requiresModule: 'reportes'
})

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')
</script>

<template>
  <main class="min-h-screen bg-transparent text-slate-900">
    <section class="mx-auto max-w-4xl overflow-x-clip px-4 pb-10 pt-6">
      <div class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center gap-3">
          <div
            class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
            style="background: var(--brand-600)"
          >
            <span class="text-sm font-bold text-white">
              {{ profileInitial }}
            </span>
            <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
              <UIcon
                name="lucide:line-chart"
                class="h-3 w-3 text-white"
              />
            </span>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Módulo
            </p>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
              Reportes
            </h1>
          </div>
        </div>
        <p class="text-sm text-slate-500">
          Exporta tus movimientos a Excel o revisa el resumen mensual.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            class="rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
            style="background: var(--brand-600)"
          >
            Exportar todo
          </button>
          <button class="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-transparent active:scale-[0.98]">
            Exportar mes actual
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="anim-up-1 rounded-3xl bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Resumen
          </p>
          <p class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Agosto 2024
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Ingresos $18,240 · Gastos $6,930
          </p>
        </div>
        <div class="anim-up-2 rounded-3xl bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Categorías
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Alimentación, Servicios, Transporte, Salud.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
