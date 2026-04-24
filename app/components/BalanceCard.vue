<script setup lang="ts">
const {
  resumen,
  pending,
  error,
  exporting,
  exportResumen,
  formatCurrency
} = useResumen()

// Porcentaje de gastos sobre ingresos — indicador de salud financiera
const saludPct = computed(() => {
  const ing = resumen.value?.ingresos ?? 0
  const gas = resumen.value?.gastos ?? 0
  if (ing <= 0) return 0
  return Math.min(100, Math.round((gas / ing) * 100))
})

const saludColor = computed(() => {
  if (saludPct.value >= 90) return { bar: 'bg-rose-400', text: 'text-rose-600', label: 'Cuidado' }
  if (saludPct.value >= 70) return { bar: 'bg-amber-400', text: 'text-amber-600', label: 'Ajustado' }
  return { bar: 'bg-emerald-400', text: 'text-emerald-600', label: 'Saludable' }
})
</script>

<template>
  <div class="rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md flex flex-col min-h-[300px]">
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:wallet"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Balance Total
          </h2>
          <p class="text-sm text-slate-500">
            Mes actual
          </p>
        </div>
      </div>
    </div>

    <!-- Empty/Loading State -->
    <div
      v-if="pending"
      class="flex-1 flex flex-col justify-center gap-4"
    >
      <USkeleton class="h-10 w-3/4 rounded-xl" />
      <div class="space-y-2">
        <USkeleton class="h-4 w-1/2 rounded-md" />
        <USkeleton class="h-4 w-1/3 rounded-md" />
      </div>
    </div>

    <div
      v-else-if="error"
      class="flex-1 flex flex-col justify-center"
    >
      <p class="text-sm font-medium text-rose-500">
        Error cargando el balance.
      </p>
    </div>

    <div
      v-else
      class="flex-1 flex flex-col justify-center"
    >
      <div class="mb-8">
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">
            {{ formatCurrency(resumen?.saldo || 0) }}
          </span>
        </div>
        <p
          class="mt-2 flex items-center gap-2 text-sm font-medium"
          :class="(resumen?.saldo || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'"
        >
          <UIcon
            :name="(resumen?.saldo || 0) >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
            class="h-4 w-4"
          />
          {{ (resumen?.saldo || 0) >= 0 ? 'Flujo positivo' : 'Flujo negativo' }}
        </p>
      </div>

      <div class="mt-auto grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ingresos
          </p>
          <p class="mt-1 font-bold text-emerald-600">
            {{ formatCurrency(resumen?.ingresos || 0) }}
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Gastos
          </p>
          <p class="mt-1 font-bold text-rose-600">
            {{ formatCurrency(resumen?.gastos || 0) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
