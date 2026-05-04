<script setup lang="ts">
type Resumen = {
  month: string
  ingresos: number
  gastos: number
  saldo: number
  saldoDisponible: number
}

type SeriesRow = {
  month: string
  ingresos: number
  gastos: number
}

const props = defineProps<{
  resumen: Resumen
  ingresosRatio: number
  gastosRatio: number
  series: SeriesRow[]
  maxSeriesValue: number
}>()

const { formatCurrency } = useFormatters()

function ratio(value: number) {
  return props.maxSeriesValue ? (value / props.maxSeriesValue) * 100 : 0
}
</script>

<template>
  <div class="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md flex flex-col min-w-0 w-full overflow-hidden">
    <h3 class="text-sm font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
      <UIcon name="lucide:trending-up" class="h-4 w-4 text-[var(--brand-500)]" />
      Tendencia & Balance
    </h3>

    <div class="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-100 flex-1 min-w-0">
      
      <!-- Lado Izquierdo: Resumen Actual -->
      <div class="flex flex-col justify-center pr-0 lg:pr-6">
        <div class="mb-5 min-w-0 w-full">
          <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 truncate">
            {{ props.resumen.month }}
          </p>
          <div class="flex items-baseline gap-2 flex-wrap min-w-0">
            <p
              class="text-[clamp(1.5rem,3vw,1.875rem)] leading-none font-extrabold tracking-tight break-words line-clamp-2"
              :class="(props.resumen.saldoDisponible ?? props.resumen.saldo) >= 0 ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ formatCurrency(props.resumen.saldoDisponible ?? props.resumen.saldo) }}
            </p>
            <span class="text-sm font-medium text-slate-400 shrink-0">Disp.</span>
          </div>
        </div>
        
        <div class="h-4 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner mb-4 flex">
          <div
            class="bg-emerald-400 transition-all duration-700 ease-out"
            :style="{ width: `${props.ingresosRatio}%` }"
          />
          <div
            class="bg-amber-400 transition-all duration-700 ease-out"
            :style="{ width: `${props.gastosRatio}%` }"
          />
        </div>
        
        <div class="grid gap-3">
          <div class="flex items-center justify-between gap-2 rounded-xl bg-transparent p-3">
            <div class="flex items-center gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UIcon name="lucide:arrow-down-left" class="h-3 w-3" />
              </span>
              <span class="text-xs font-medium text-slate-600">Ingresos</span>
            </div>
            <span class="text-sm font-bold text-slate-900">{{ formatCurrency(props.resumen.ingresos) }}</span>
          </div>
          <div class="flex items-center justify-between gap-2 rounded-xl bg-transparent p-3">
            <div class="flex items-center gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <UIcon name="lucide:arrow-up-right" class="h-3 w-3" />
              </span>
              <span class="text-xs font-medium text-slate-600">Gastos</span>
            </div>
            <span class="text-sm font-bold text-slate-900">{{ formatCurrency(props.resumen.gastos) }}</span>
          </div>
        </div>
      </div>

      <!-- Lado Derecho: Histórico 6 Meses -->
      <div class="flex flex-col justify-end pl-0 pt-8 mt-2 lg:mt-0 lg:pt-0 lg:pl-6 border-t lg:border-t-0 border-slate-100 min-w-0 w-full overflow-hidden">
        <span class="mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Últimos meses</span>
        
        <!-- Contenedor del Chart -->
        <div class="grid grid-cols-6 h-36 items-end gap-1 sm:gap-2 w-full">
          <div
            v-for="row in props.series"
            :key="row.month"
            class="group flex flex-col items-center gap-2 relative w-full"
          >
            <!-- Barras -->
            <div class="flex h-28 w-full items-end justify-center gap-0.5 sm:gap-1 rounded-lg hover:bg-slate-50 transition-colors p-1">
              <div
                class="w-1.5 sm:w-2 rounded-t-full bg-emerald-400/80 transition-all duration-500 group-hover:bg-emerald-500"
                :style="{ height: `${Math.max(ratio(row.ingresos), 4)}%` }"
              />
              <div
                class="w-1.5 sm:w-2 rounded-t-full bg-amber-400/80 transition-all duration-500 group-hover:bg-amber-500"
                :style="{ height: `${Math.max(ratio(row.gastos), 4)}%` }"
              />
            </div>
            <!-- Mes -->
            <span class="text-[10px] font-medium text-slate-400">{{ row.month.substring(0,3) }}</span>

            <!-- Tooltip Hover (Solo en Desktop) -->
            <div class="hidden sm:block pointer-events-none absolute bottom-full mb-2 left-1/2 z-10 -translate-x-1/2 invisible opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 w-max rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white">
              <p class="font-bold mb-1 border-b border-slate-600 pb-1">{{ row.month }}</p>
              <p class="text-emerald-400 flex justify-between gap-2"><span>Ing:</span> <span>{{ formatCurrency(row.ingresos) }}</span></p>
              <p class="text-amber-400 flex justify-between gap-2"><span>Gas:</span> <span>{{ formatCurrency(row.gastos) }}</span></p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
