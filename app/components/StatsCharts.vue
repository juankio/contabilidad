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
  saldo: 0,
  saldoDisponible: 0
})
</script>

<template>
  <div class="self-start rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2 lg:col-span-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2 text-slate-700">
        <UIcon
          name="lucide:chart-bar"
          class="h-4 w-4"
        />
        <p class="text-sm font-semibold">
          Estadísticas
        </p>
      </div>
      <div class="max-w-full pb-1">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="item in profileFilterItems"
            :key="item.value"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
            :class="selectedProfileId === item.value ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            :style="selectedProfileId === item.value ? { background: 'var(--brand-600)' } : {}"
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
