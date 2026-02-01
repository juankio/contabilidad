<script setup lang="ts">
type Estadisticas = {
  resumen: {
    month: string,
    ingresos: number,
    gastos: number,
    saldo: number,
  },
  categorias: Array<{
    category: string,
    total: number,
  }>,
  series: Array<{
    month: string,
    ingresos: number,
    gastos: number,
  }>,
}

const { data, pending, error } = await useFetch<Estadisticas>('/api/estadisticas', {
  key: 'estadisticas'
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value)

const categoriasSegments = computed(() => {
  const categorias = data.value?.categorias ?? []
  const palette = ['#0ea5e9', '#10b981', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6']
  return categorias.map((categoria, index) => ({
    label: categoria.category,
    value: categoria.total,
    color: palette[index % palette.length]
  }))
})

const ingresosRatio = computed(() => {
  const ingresos = data.value?.resumen.ingresos ?? 0
  const gastos = data.value?.resumen.gastos ?? 0
  const total = ingresos + gastos
  if (!total) {
    return 0
  }
  return Math.round((ingresos / total) * 100)
})

const gastosRatio = computed(() => {
  if (!ingresosRatio.value && !(data.value?.resumen.gastos ?? 0)) {
    return 0
  }
  return Math.max(0, 100 - ingresosRatio.value)
})

const maxCategoryValue = computed(() => {
  const values = categoriasSegments.value.map(categoria => categoria.value)
  return Math.max(1, ...values)
})

const maxSeriesValue = computed(() => {
  const series = data.value?.series ?? []
  return Math.max(1, ...series.map(row => Math.max(row.ingresos, row.gastos)))
})
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-3">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">
          Estadisticas
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Resumen visual del mes actual.
        </p>
      </div>
    </div>

    <div v-if="pending" class="mt-6 text-sm text-slate-500">
      Cargando estadisticas...
    </div>
    <div v-else-if="error" class="mt-6 text-sm text-rose-500">
      No se pudieron cargar.
    </div>
    <div v-else class="mt-6 grid gap-6 lg:grid-cols-3">
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
                  :style="{ width: `${ingresosRatio}%` }"
                ></div>
                <div
                  class="bg-amber-500"
                  :style="{ width: `${gastosRatio}%` }"
                ></div>
              </div>
            </div>
            <p class="text-xs text-slate-500">
              {{ data?.resumen.month }}
            </p>
          </div>
          <div class="grid gap-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Ingresos</span>
              <span class="ml-auto text-xs text-slate-400">{{ ingresosRatio }}%</span>
              <span class="font-semibold">
                {{ formatCurrency(data?.resumen.ingresos ?? 0) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>Gastos</span>
              <span class="ml-auto text-xs text-slate-400">{{ gastosRatio }}%</span>
              <span class="font-semibold">
                {{ formatCurrency(data?.resumen.gastos ?? 0) }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-slate-500">
              <span class="h-2 w-2 rounded-full bg-slate-300"></span>
              <span>Saldo</span>
              <span
                class="ml-auto font-semibold"
                :class="(data?.resumen.saldo ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'"
              >
                {{ formatCurrency(data?.resumen.saldo ?? 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-100 p-4">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
          Gastos por categoria
        </p>
        <div class="mt-4 grid gap-3">
          <div
            v-for="categoria in categoriasSegments"
            :key="categoria.label"
            class="grid gap-2"
          >
            <div class="flex items-center justify-between text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span
                  class="h-2 w-2 rounded-full"
                  :style="{ backgroundColor: categoria.color }"
                ></span>
                <span class="truncate">{{ categoria.label }}</span>
              </div>
              <span class="font-semibold">{{ formatCurrency(categoria.value) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full"
                :style="{
                  width: `${(categoria.value / maxCategoryValue) * 100}%`,
                  backgroundColor: categoria.color
                }"
              ></div>
            </div>
          </div>
          <div v-if="!categoriasSegments.length" class="text-sm text-slate-400">
            Sin gastos registrados.
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-100 p-4">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
          Ultimos 6 meses
        </p>
        <div class="mt-4 grid gap-3">
          <div
            v-for="row in data?.series"
            :key="row.month"
            class="grid grid-cols-[40px_1fr] items-center gap-3"
          >
            <span class="text-xs text-slate-500">{{ row.month }}</span>
            <div class="flex items-end gap-2">
              <div
                class="h-10 w-4 rounded-full bg-emerald-500/80"
                :style="{ height: `${(row.ingresos / maxSeriesValue) * 40 + 6}px` }"
                title="Ingresos"
              ></div>
              <div
                class="h-10 w-4 rounded-full bg-amber-500/80"
                :style="{ height: `${(row.gastos / maxSeriesValue) * 40 + 6}px` }"
                title="Gastos"
              ></div>
              <span class="ml-2 text-xs text-slate-500">
                {{ formatCurrency(row.ingresos - row.gastos) }}
              </span>
            </div>
          </div>
          <div class="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              Ingresos
            </span>
            <span class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-500"></span>
              Gastos
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
