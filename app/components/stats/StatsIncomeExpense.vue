<script setup lang="ts">
type Resumen = {
  month: string
  ingresos: number
  gastos: number
  saldo: number
}

const props = defineProps<{
  resumen: Resumen
  ingresosRatio: number
  gastosRatio: number
}>()

const { formatCurrency } = useFormatters()
</script>

<template>
  <div class="rounded-2xl border border-slate-100 p-4">
    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
      Ingresos vs gastos
    </p>
    <div class="mt-4 grid gap-4">
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
      <div class="grid gap-2 text-sm">
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:items-center">
          <span class="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Ingresos</span>
          <span class="text-xs text-slate-400 sm:ml-auto">{{ props.ingresosRatio }}%</span>
          <span class="font-semibold">
            {{ formatCurrency(props.resumen.ingresos) }}
          </span>
        </div>
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:items-center">
          <span class="h-2 w-2 rounded-full bg-amber-500" />
          <span>Gastos</span>
          <span class="text-xs text-slate-400 sm:ml-auto">{{ props.gastosRatio }}%</span>
          <span class="font-semibold">
            {{ formatCurrency(props.resumen.gastos) }}
          </span>
        </div>
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-slate-500 sm:flex sm:items-center">
          <span class="h-2 w-2 rounded-full bg-slate-300" />
          <span>Saldo</span>
          <span
            class="font-semibold sm:ml-auto"
            :class="props.resumen.saldo >= 0 ? 'text-emerald-600' : 'text-rose-500'"
          >
            {{ formatCurrency(props.resumen.saldo) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
