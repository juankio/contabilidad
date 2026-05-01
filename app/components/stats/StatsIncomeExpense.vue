<script setup lang="ts">
type Resumen = {
  month: string
  ingresos: number
  gastos: number
  saldo: number
  saldoDisponible: number
}

const props = defineProps<{
  resumen: Resumen
  ingresosRatio: number
  gastosRatio: number
}>()

const { formatCurrency } = useFormatters()
</script>

<template>
  <div class="rounded-[1.5rem] border max-sm:border-none border-slate-100/50 bg-transparent max-sm:bg-transparent p-5 max-sm:p-0 shadow-sm max-sm:shadow-none">
    <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 max-sm:hidden">
      Ingresos vs gastos
    </p>
    <div class="mt-4 max-sm:mt-1 grid gap-4">
      <div class="grid gap-2">
        <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div class="flex h-full">
            <div
              class="bg-emerald-500"
              :style="{ width: `${props.ingresosRatio}%` }"
            />
            <div
              class="bg-amber-500"
              :style="{ width: `${props.gastosRatio}%` }"
            />
          </div>
        </div>
        <p class="text-xs text-slate-500">
          {{ props.resumen.month }}
        </p>
      </div>
      <div class="grid gap-2.5">
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Ingresos
            <span class="text-xs text-slate-400">{{ props.ingresosRatio }}%</span>
          </span>
          <span class="text-sm font-semibold text-slate-800">
            {{ formatCurrency(props.resumen.ingresos) }}
          </span>
        </div>
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <span class="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Gastos
            <span class="text-xs text-slate-400">{{ props.gastosRatio }}%</span>
          </span>
          <span class="text-sm font-semibold text-slate-800">
            {{ formatCurrency(props.resumen.gastos) }}
          </span>
        </div>
        <div class="mt-1 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          <span class="flex items-center gap-2 text-sm text-slate-500">
            <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
            Saldo disponible
          </span>
          <span
            class="text-sm font-semibold"
            :class="(props.resumen.saldoDisponible ?? props.resumen.saldo) >= 0 ? 'text-emerald-600' : 'text-rose-500'"
          >
            {{ formatCurrency(props.resumen.saldoDisponible ?? props.resumen.saldo) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
