<script setup lang="ts">
type SeriesRow = {
  month: string
  ingresos: number
  gastos: number
}

const props = defineProps<{
  series: SeriesRow[]
  maxValue: number
}>()

const { formatCurrency } = useFormatters()

function ratio(value: number) {
  return props.maxValue ? (value / props.maxValue) * 100 : 0
}
</script>

<template>
  <div class="rounded-2xl border border-slate-100 p-4">
    <p class="text-xs font-semibold uppercase tracking-widest text-slate-500">
      Últimos 6 meses
    </p>

    <!-- Mobile + Tablet (dentro del tab, ancho completo) -->
    <div class="mt-4 grid gap-3 lg:hidden">
      <div
        v-for="row in props.series"
        :key="row.month"
        class="flex items-center gap-3"
      >
        <span class="w-8 shrink-0 text-xs font-medium text-slate-500 uppercase">{{ row.month }}</span>
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-emerald-500/80 transition-all duration-500"
              :style="{ width: `${ratio(row.ingresos)}%` }"
            />
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-amber-500/80 transition-all duration-500"
              :style="{ width: `${ratio(row.gastos)}%` }"
            />
          </div>
        </div>
        <span
          class="w-24 shrink-0 text-right text-xs font-semibold"
          :class="row.ingresos - row.gastos >= 0 ? 'text-emerald-700' : 'text-rose-600'"
        >
          {{ formatCurrency(row.ingresos - row.gastos) }}
        </span>
      </div>

      <div class="mt-1 flex items-center gap-4 text-xs text-slate-500">
        <span class="flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-emerald-500" />Ingresos
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-amber-500" />Gastos
        </span>
        <span class="ml-auto font-medium text-slate-400">Saldo</span>
      </div>
    </div>

    <!-- Desktop: barras verticales -->
    <div class="mt-4 hidden gap-3 lg:grid">
      <div
        v-for="row in props.series"
        :key="row.month"
        class="grid grid-cols-[40px_1fr] items-center gap-3"
      >
        <span class="text-sm text-slate-600">{{ row.month }}</span>
        <div class="flex items-end gap-2">
          <div
            class="w-4 rounded-full bg-emerald-500/80"
            :style="{ height: `${ratio(row.ingresos) * 0.4 + 6}px` }"
            title="Ingresos"
          />
          <div
            class="w-4 rounded-full bg-amber-500/80"
            :style="{ height: `${ratio(row.gastos) * 0.4 + 6}px` }"
            title="Gastos"
          />
          <span
            class="ml-1 text-sm font-medium"
            :class="row.ingresos - row.gastos >= 0 ? 'text-emerald-700' : 'text-rose-500'"
          >
            {{ formatCurrency(row.ingresos - row.gastos) }}
          </span>
        </div>
      </div>
      <div class="mt-1 flex items-center gap-4 text-xs text-slate-500">
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500" />Ingresos
        </span>
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-amber-500" />Gastos
        </span>
      </div>
    </div>
  </div>
</template>
