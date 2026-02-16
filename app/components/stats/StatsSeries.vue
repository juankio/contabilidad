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

    <div class="mt-4 grid gap-3 sm:hidden">
      <div
        v-for="row in props.series"
        :key="`mobile-${row.month}`"
        class="rounded-xl bg-slate-50 p-3"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{{ row.month }}</span>
          <span
            class="text-xs font-semibold"
            :class="row.ingresos - row.gastos >= 0 ? 'text-emerald-700' : 'text-rose-600'"
          >
            {{ formatCurrency(row.ingresos - row.gastos) }}
          </span>
        </div>

        <div class="space-y-2">
          <div>
            <div class="mb-1 flex items-center justify-between text-[11px] text-slate-500">
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-emerald-500" />
                Ingresos
              </span>
              <span>{{ formatCurrency(row.ingresos) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                class="h-full rounded-full bg-emerald-500/90"
                :style="{ width: `${(row.ingresos / props.maxValue) * 100}%` }"
              />
            </div>
          </div>

          <div>
            <div class="mb-1 flex items-center justify-between text-[11px] text-slate-500">
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-amber-500" />
                Gastos
              </span>
              <span>{{ formatCurrency(row.gastos) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                class="h-full rounded-full bg-amber-500/90"
                :style="{ width: `${(row.gastos / props.maxValue) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 hidden grid-cols-2 gap-3 sm:grid lg:hidden">
      <div
        v-for="row in props.series"
        :key="`tablet-${row.month}`"
        class="rounded-xl border border-slate-100 p-3"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{{ row.month }}</span>
          <span
            class="text-xs font-semibold"
            :class="row.ingresos - row.gastos >= 0 ? 'text-emerald-700' : 'text-rose-600'"
          >
            {{ formatCurrency(row.ingresos - row.gastos) }}
          </span>
        </div>

        <div class="space-y-2">
          <div>
            <div class="mb-1 flex items-center justify-between text-[11px] text-slate-500">
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-emerald-500" />
                Ingresos
              </span>
              <span>{{ formatCurrency(row.ingresos) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                class="h-full rounded-full bg-emerald-500/85"
                :style="{ width: `${(row.ingresos / props.maxValue) * 100}%` }"
              />
            </div>
          </div>

          <div>
            <div class="mb-1 flex items-center justify-between text-[11px] text-slate-500">
              <span class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-amber-500" />
                Gastos
              </span>
              <span>{{ formatCurrency(row.gastos) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                class="h-full rounded-full bg-amber-500/85"
                :style="{ width: `${(row.gastos / props.maxValue) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 hidden gap-3 lg:grid">
      <div
        v-for="row in props.series"
        :key="`desktop-${row.month}`"
        class="grid grid-cols-[32px_1fr] items-center gap-2 sm:grid-cols-[40px_1fr] sm:gap-3"
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
          <span class="ml-1 text-xs text-slate-500 sm:ml-2">
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
