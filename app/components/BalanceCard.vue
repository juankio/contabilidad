<script setup lang="ts">
import { animate } from 'animejs'

const {
  resumen,
  pending,
  error,
  exporting,
  exportResumen,
  formatCurrency
} = useResumen()

// Animación de los contadores de números
const animatedSaldoDisponible = ref(0)
const animatedIngresos = ref(0)
const animatedGastos = ref(0)

watch(resumen, (newResumen) => {
  if (newResumen) {
    const obj = { 
      saldo: animatedSaldoDisponible.value,
      ingresos: animatedIngresos.value,
      gastos: animatedGastos.value
    }

    animate(obj, {
      saldo: newResumen.saldoDisponible || 0,
      ingresos: newResumen.ingresos || 0,
      gastos: newResumen.gastos || 0,
      duration: 1200,
      easing: 'easeOutExpo',
      update: () => {
        animatedSaldoDisponible.value = obj.saldo
        animatedIngresos.value = obj.ingresos
        animatedGastos.value = obj.gastos
      }
    })
  }
}, { deep: true, immediate: true })

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
  <div class="rounded-[2rem] border border-white/60 bg-white/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 flex flex-col min-h-[300px]">
    <div class="mb-6 flex items-start justify-between">
        <div class="flex items-center gap-4 min-w-0">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
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
      <div class="mb-8">
        <div class="flex flex-col gap-1 min-w-0">
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider truncate">Dinero Disponible</span>
          <span class="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl truncate">
            {{ formatCurrency(animatedSaldoDisponible) }}
          </span>
        </div>
        <p
          class="mt-3 flex items-center gap-2 text-xs sm:text-sm font-medium flex-wrap"
          :class="(resumen?.saldo || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'"
        >
          <span class="flex items-center gap-1 shrink-0">
            <UIcon
              :name="(resumen?.saldo || 0) >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
              class="h-4 w-4"
            />
            {{ (resumen?.saldo || 0) >= 0 ? 'Flujo del mes positivo' : 'Flujo del mes negativo' }}
          </span>
          <span class="font-bold truncate">({{ formatCurrency(resumen?.saldo || 0) }})</span>
        </p>
      </div>

      <div class="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            Ingresos
          </p>
          <p class="mt-1 font-bold text-emerald-600 truncate">
            {{ formatCurrency(animatedIngresos) }}
          </p>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            Gastos
          </p>
          <p class="mt-1 font-bold text-rose-600 truncate">
            {{ formatCurrency(animatedGastos) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
