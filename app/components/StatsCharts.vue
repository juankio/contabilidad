<script setup lang="ts">
import StatsTrendChart from './stats/StatsTrendChart.vue'
import StatsCategoryChart from './stats/StatsCategoryChart.vue'

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
  <div class="self-start flex flex-col min-w-0 w-full overflow-hidden">
    <!-- Header Controls -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--brand-600)] shadow-sm ring-1 ring-slate-200 shrink-0">
          <UIcon name="lucide:activity" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Estadísticas
          </h2>
        </div>
      </div>

      <!-- Profile Filters -->
      <div class="flex overflow-x-auto pb-1 sm:pb-0 scrollbar-hide max-w-full">
        <div class="flex items-center gap-2">
          <button
            v-for="item in profileFilterItems"
            :key="item.value"
            type="button"
            class="whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 border"
            :class="selectedProfileId === item.value ? 'text-white border-transparent shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            :style="selectedProfileId === item.value ? { background: 'var(--brand-500)' } : {}"
            @click="selectedProfileId = item.value"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="pending" class="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
      <UIcon name="lucide:loader-2" class="h-6 w-6 animate-spin text-slate-400" />
    </div>
    <div v-else-if="error" class="flex h-64 flex-col items-center justify-center gap-2 rounded-3xl border border-rose-200 bg-rose-50 text-rose-500">
      <UIcon name="lucide:alert-circle" class="h-6 w-6" />
      <span class="text-sm font-medium">Error al cargar estadísticas</span>
    </div>

    <template v-else>
      <!-- Charts Grid -->
      <div class="grid gap-6 xl:grid-cols-2 mt-2">
        <StatsTrendChart
          class="anim-up-1"
          :resumen="resumen"
          :ingresos-ratio="ingresosRatio"
          :gastos-ratio="gastosRatio"
          :series="data?.series || []"
          :max-series-value="maxSeriesValue"
        />
        <StatsCategoryChart
          class="anim-up-2"
          :categorias="categoriasSegments"
          :max-value="maxCategoryValue"
        />
      </div>
    </template>
  </div>
</template>
