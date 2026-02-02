<script setup lang="ts">
import StatsIncomeExpense from './stats/StatsIncomeExpense.vue'
import StatsCategories from './stats/StatsCategories.vue'
import StatsSeries from './stats/StatsSeries.vue'

const {
  data,
  pending,
  error,
  categoriasSegments,
  ingresosRatio,
  gastosRatio,
  maxCategoryValue,
  maxSeriesValue
} = await useEstadisticas()

const resumen = computed(() => data.value?.resumen ?? {
  month: '',
  ingresos: 0,
  gastos: 0,
  saldo: 0
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
