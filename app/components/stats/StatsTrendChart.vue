<script setup lang="ts">
import { animate, stagger } from 'animejs'
import { onMounted } from 'vue'

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

onMounted(() => {
  if (import.meta.client) {
    animate('.anim-bar', {
      height: ['0%', (el: HTMLElement) => el.style.height],
      duration: 1000,
      ease: 'outElastic(1, .8)',
      delay: stagger(50, { start: 300 })
    })
  }
})
</script>

<template>
  <div class="h-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md flex flex-col min-w-0 w-full">
    <h3 class="text-sm font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-2 shrink-0">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20 shadow-sm">
        <UIcon
          name="lucide:trending-up"
          class="h-4 w-4"
        />
      </div>
      Tendencia & Balance
    </h3>

    <div class="flex flex-col flex-1 min-w-0 w-full gap-8">
      <!-- Bloque 1: Resumen Actual Apilado -->
      <div class="flex flex-col justify-center min-w-0 w-full">
        <div class="mb-5 min-w-0 w-full">
          <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 truncate">
            {{ props.resumen.month }}
          </p>
          <div class="flex items-baseline gap-2 flex-wrap min-w-0">
            <p class="text-[clamp(1.75rem,4vw,2.5rem)] leading-none font-extrabold tracking-tight break-all line-clamp-2 text-slate-900">
              <span
                v-if="(props.resumen.saldoDisponible ?? props.resumen.saldo) < 0"
                class="text-rose-500 mr-1"
              >-</span>
              <span :class="(props.resumen.saldoDisponible ?? props.resumen.saldo) >= 0 ? 'text-emerald-600' : ''">
                {{ formatCurrency(Math.abs(props.resumen.saldoDisponible ?? props.resumen.saldo)) }}
              </span>
            </p>
            <span class="text-sm font-medium text-slate-400 shrink-0">Balance</span>
          </div>
        </div>

        <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner mb-4 flex">
          <div
            class="bg-emerald-400 transition-all duration-700 ease-out"
            :style="{ width: `${props.ingresosRatio}%` }"
          />
          <div
            class="bg-amber-400 transition-all duration-700 ease-out"
            :style="{ width: `${props.gastosRatio}%` }"
          />
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
          <div class="flex flex-col gap-1.5 sm:gap-2 rounded-2xl bg-emerald-50/50 p-3 border border-emerald-100/50 overflow-hidden">
            <div class="flex items-center gap-2 min-w-0">
              <span class="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UIcon
                  name="lucide:arrow-down-left"
                  class="h-3 w-3"
                />
              </span>
              <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700/70 truncate">Ingresos</span>
            </div>
            <span class="text-sm sm:text-base font-bold text-emerald-900 break-all line-clamp-1 tabular-nums">{{ formatCurrency(props.resumen.ingresos) }}</span>
          </div>
          <div class="flex flex-col gap-1.5 sm:gap-2 rounded-2xl bg-amber-50/50 p-3 border border-amber-100/50 overflow-hidden">
            <div class="flex items-center gap-2 min-w-0">
              <span class="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <UIcon
                  name="lucide:arrow-up-right"
                  class="h-3 w-3"
                />
              </span>
              <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700/70 truncate">Gastos</span>
            </div>
            <span class="text-sm sm:text-base font-bold text-amber-900 break-all line-clamp-1 tabular-nums">{{ formatCurrency(props.resumen.gastos) }}</span>
          </div>
        </div>
      </div>

      <!-- Bloque 2: Histórico 6 Meses Extendido -->
      <div class="flex flex-col justify-end min-w-0 w-full border-t border-slate-100 pt-6 mt-auto">
        <span class="mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Desempeño mensual</span>

        <!-- Contenedor del Chart Expandido -->
        <div class="grid grid-cols-6 h-36 sm:h-40 items-end w-full px-1 gap-2 sm:gap-4">
          <div
            v-for="row in props.series"
            :key="row.month"
            class="group flex flex-col items-center gap-2 relative w-full h-full justify-end"
          >
            <!-- Barras -->
            <div class="flex h-full max-h-[7rem] sm:max-h-[8rem] w-full items-end justify-center gap-0.5 sm:gap-1.5 rounded-xl hover:bg-slate-50 transition-colors p-1 sm:p-1.5 cursor-pointer">
              <div
                class="anim-bar w-1.5 sm:w-2.5 rounded-t-full bg-emerald-400 transition-colors duration-300 group-hover:bg-emerald-500"
                :style="{ height: `${Math.max(ratio(row.ingresos), 4)}%` }"
              />
              <div
                class="anim-bar w-1.5 sm:w-2.5 rounded-t-full bg-amber-400 transition-colors duration-300 group-hover:bg-amber-500"
                :style="{ height: `${Math.max(ratio(row.gastos), 4)}%` }"
              />
            </div>
            <!-- Mes -->
            <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ row.month.substring(0, 3) }}</span>

            <!-- Tooltip Hover -->
            <div class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 -translate-x-1/2 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 w-max rounded-xl bg-slate-800 px-3 py-2 text-xs text-white">
              <p class="font-bold mb-1 border-b border-slate-600 pb-1 uppercase tracking-wider text-[10px]">
                {{ row.month }}
              </p>
              <div class="flex flex-col gap-1 mt-1.5">
                <p class="text-emerald-400 flex items-center justify-between gap-4 font-medium">
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ing</span> <span class="tabular-nums font-bold">{{ formatCurrency(row.ingresos) }}</span>
                </p>
                <p class="text-amber-400 flex items-center justify-between gap-4 font-medium">
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-400" /> Gas</span> <span class="tabular-nums font-bold">{{ formatCurrency(row.gastos) }}</span>
                </p>
              </div>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
