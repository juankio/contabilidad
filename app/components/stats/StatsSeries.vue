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
</script>

<template>
  <div class="rounded-2xl border border-slate-100 p-4">
    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
      Ultimos 6 meses
    </p>
    <div class="mt-4 grid gap-3">
      <div
        v-for="row in props.series"
        :key="row.month"
        class="grid grid-cols-[40px_1fr] items-center gap-3"
      >
        <span class="text-xs text-slate-500">{{ row.month }}</span>
        <div class="flex items-end gap-2">
          <div
            class="h-10 w-4 rounded-full bg-emerald-500/80"
            :style="{ height: `${(row.ingresos / props.maxValue) * 40 + 6}px` }"
            title="Ingresos"
          />
          <div
            class="h-10 w-4 rounded-full bg-amber-500/80"
            :style="{ height: `${(row.gastos / props.maxValue) * 40 + 6}px` }"
            title="Gastos"
          />
          <span class="ml-2 text-xs text-slate-500">
            {{ formatCurrency(row.ingresos - row.gastos) }}
          </span>
        </div>
      </div>
      <div class="mt-2 flex items-center gap-4 text-xs text-slate-500">
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500" />
          Ingresos
        </span>
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-amber-500" />
          Gastos
        </span>
      </div>
    </div>
  </div>
</template>
