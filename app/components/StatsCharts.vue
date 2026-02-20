<script setup lang="ts">
import StatsIncomeExpense from './stats/StatsIncomeExpense.vue'
import StatsCategories from './stats/StatsCategories.vue'
import StatsSeries from './stats/StatsSeries.vue'

const {
  selectedProfileId,
  profileFilterItems,
  data,
  pending,
  error,
  categoriasSegments,
  ingresosRatio,
  gastosRatio,
  maxCategoryValue,
  maxSeriesValue
} = useEstadisticas()

const resumen = computed(() => data.value?.resumen ?? {
  month: '',
  ingresos: 0,
  gastos: 0,
  saldo: 0
})
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold">
          Estadisticas
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Resumen visual del mes actual y ultimos 6 meses.
        </p>
      </div>
      <div class="max-w-full pb-1">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="item in profileFilterItems"
            :key="item.value"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium"
            :class="selectedProfileId === item.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
            @click="selectedProfileId = item.value"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="pending"
      class="mt-6 text-sm text-slate-500"
    >
      Cargando estadisticas...
    </div>
    <div
      v-else-if="error"
      class="mt-6 text-sm text-rose-500"
    >
      No se pudieron cargar.
    </div>
    <div
      v-else
      class="mt-6 grid gap-6 lg:grid-cols-3"
    >
      <StatsIncomeExpense
        :resumen="resumen"
        :ingresos-ratio="ingresosRatio"
        :gastos-ratio="gastosRatio"
      />
      <StatsCategories
        :categorias="categoriasSegments"
        :max-value="maxCategoryValue"
      />
      <StatsSeries
        :series="data?.series || []"
        :max-value="maxSeriesValue"
      />
    </div>
  </div>
</template>
