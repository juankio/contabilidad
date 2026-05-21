<script setup lang="ts">
const {
  resumen,
  pending,
  error,
  formatCurrency
} = useResumen()

const animatedSaldoDisponible = computed(() => resumen.value?.saldoDisponible ?? 0)
const animatedIngresos = computed(() => resumen.value?.ingresos ?? 0)
const animatedGastos = computed(() => resumen.value?.gastos ?? 0)

// Porcentaje de gastos sobre fondos totales disponibles (incluyendo saldo histórico)
const saludPct = computed(() => {
  const saldoActual = resumen.value?.saldoDisponible ?? 0
  const gastosMes = resumen.value?.gastos ?? 0
  
  // Total de fondos de los que se disponía ANTES de los gastos de este mes
  const fondosBase = saldoActual + gastosMes
  
  if (fondosBase <= 0) return gastosMes > 0 ? -1 : 0 // -1 significa sobregirado sin fondos
  return Math.round((gastosMes / fondosBase) * 100)
})

const saludColor = computed(() => {
  if (saludPct.value === -1 || saludPct.value > 100) return { bar: 'bg-rose-500', text: 'text-rose-600', label: 'Sobregirado' }
  if (saludPct.value >= 90) return { bar: 'bg-rose-400', text: 'text-rose-600', label: 'Cuidado' }
  if (saludPct.value >= 70) return { bar: 'bg-amber-400', text: 'text-amber-600', label: 'Ajustado' }
  return { bar: 'bg-emerald-400', text: 'text-emerald-600', label: 'Saludable' }
})
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col min-h-[300px]">
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4 min-w-0">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:wallet"
            class="h-5 w-5"
          />
        </div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold tracking-tight text-slate-900 truncate">
            Balance Total
          </h2>
          <p class="text-sm text-slate-500 truncate">
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
      <div class="mb-6 w-full min-w-0">
        <div class="flex flex-col w-full min-w-0">
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider truncate mb-1">Balance Actual</span>
          <span class="text-[clamp(1.875rem,5vw,3rem)] leading-[1.1] font-bold tracking-tight break-words line-clamp-2 text-slate-700">
            <span
              v-if="animatedSaldoDisponible < 0"
              class="text-rose-500 mr-1"
            >-</span><span>{{ formatCurrency(Math.abs(animatedSaldoDisponible)) }}</span>
          </span>
        </div>

        <div class="mt-5 flex items-center gap-3">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="saludColor.bar"
              :style="{ width: `${saludPct === -1 ? 100 : Math.min(100, saludPct)}%` }"
            />
          </div>
          <span
            class="text-xs font-semibold tracking-wide"
            :class="saludColor.text"
          >
            {{ saludPct === -1 ? 'Gastos sin fondos' : `${saludPct}% Consumido` }}
          </span>
        </div>
      </div>

      <div class="mt-auto grid grid-cols-2 gap-4 border-t border-slate-100/80 pt-5">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
            Ingresos
          </p>
          <p class="mt-1 font-semibold text-slate-700 truncate text-lg">
            {{ formatCurrency(animatedIngresos) }}
          </p>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
            Gastos
          </p>
          <p class="mt-1 font-semibold text-slate-700 truncate text-lg">
            {{ formatCurrency(animatedGastos) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
