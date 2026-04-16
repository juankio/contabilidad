<script setup lang="ts">
const {
  resumen,
  pending,
  error,
  exporting,
  exportResumen,
  formatCurrency
} = await useResumen()

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
  <div class="self-start rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 md:col-span-2 lg:col-span-1">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <UIcon
            name="lucide:wallet"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Balance mensual
          </h2>
          <p class="text-sm text-slate-500">
            {{ resumen?.month || 'Mes actual' }}
          </p>
        </div>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        :loading="exporting"
        :disabled="exporting"
        @click="exportResumen"
      >
        Excel
      </UButton>
    </div>

    <!-- Skeletons -->
    <div
      v-if="pending"
      class="mt-5 space-y-3"
    >
      <div class="skeleton h-16 w-full" />
      <div class="skeleton h-16 w-full" />
      <div class="skeleton h-16 w-full" />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="mt-5 rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-500"
    >
      No se pudo cargar el resumen.
    </div>

    <!-- Data -->
    <div
      v-else
      class="mt-5 space-y-3"
    >
      <!-- Ingresos -->
      <div class="anim-up group rounded-3xl bg-emerald-50 px-4 py-3 transition-colors duration-200 hover:bg-emerald-100/60">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Ingresos
          </p>
          <UIcon
            name="lucide:trending-up"
            class="h-3.5 w-3.5 text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </div>
        <p class="mt-1 text-xl font-semibold text-emerald-700">
          {{ formatCurrency(resumen?.ingresos ?? 0) }}
        </p>
      </div>

      <!-- Gastos -->
      <div class="anim-up-1 group rounded-3xl bg-amber-50 px-4 py-3 transition-colors duration-200 hover:bg-amber-100/60">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Gastos
          </p>
          <UIcon
            name="lucide:trending-down"
            class="h-3.5 w-3.5 text-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </div>
        <p class="mt-1 text-xl font-semibold text-amber-700">
          {{ formatCurrency(resumen?.gastos ?? 0) }}
        </p>
      </div>

      <!-- Saldo -->
      <div
        class="anim-up-2 rounded-3xl px-4 py-3 text-white"
        style="background: var(--brand-600)"
      >
        <p class="text-xs font-semibold uppercase tracking-widest text-white/70">
          Disponible
        </p>
        <p class="mt-1 text-xl font-semibold">
          {{ formatCurrency(resumen?.saldoDisponible ?? resumen?.saldo ?? 0) }}
        </p>
      </div>

      <!-- Indicador de salud financiera -->
      <div
        v-if="resumen?.ingresos"
        class="anim-up-3 rounded-3xl border border-slate-100 px-4 py-3"
      >
        <div class="mb-2 flex items-center justify-between">
          <p class="text-xs text-slate-400">
            Gastos vs ingresos
          </p>
          <span
            class="text-xs font-semibold"
            :class="saludColor.text"
          >
            {{ saludColor.label }} · {{ saludPct }}%
          </span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            class="anim-bar h-full rounded-full transition-all duration-500"
            :class="saludColor.bar"
            :style="{ width: `${saludPct}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
