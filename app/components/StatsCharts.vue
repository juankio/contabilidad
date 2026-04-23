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

const tabs = [
  { label: 'Resumen' },
  { label: 'Categorías' },
  { label: 'Histórico' }
]
const activeTab = ref(0)
</script>

<template>
  <div class="self-start rounded-[2rem] border border-slate-200/60 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl md:col-span-2 lg:col-span-3">
    <!-- Header -->
    <div class="flex items-center justify-between gap-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20 shrink-0">
          <UIcon
            name="lucide:bar-chart-3"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Estadísticas
          </h2>
          <p class="text-sm text-slate-500 hidden sm:block">
            Resumen financiero de los últimos meses.
          </p>
        </div>
      </div>

      <!-- Desktop: filtros de perfil -->
      <div class="hidden max-w-full lg:block">
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

    <!-- Loading / Error -->
    <div
      v-if="pending"
      class="mt-6 text-sm text-slate-500"
    >
      Cargando estadísticas...
    </div>
    <div
      v-else-if="error"
      class="mt-6 text-sm text-rose-500"
    >
      No se pudieron cargar.
    </div>

    <template v-else>
      <!-- Mobile: segmented control + filtros de perfil -->
      <div class="mt-3 lg:hidden">
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

        <div class="mt-3 flex rounded-xl bg-slate-100 p-1">
          <button
            v-for="(tab, i) in tabs"
            :key="i"
            type="button"
            class="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-150"
            :class="activeTab === i
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'"
            @click="activeTab = i"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="mt-3">
          <StatsIncomeExpense
            v-if="activeTab === 0"
            :resumen="resumen"
            :ingresos-ratio="ingresosRatio"
            :gastos-ratio="gastosRatio"
          />
          <StatsCategories
            v-else-if="activeTab === 1"
            :categorias="categoriasSegments"
            :max-value="maxCategoryValue"
          />
          <StatsSeries
            v-else
            :series="data?.series || []"
            :max-value="maxSeriesValue"
          />
        </div>
      </div>

      <!-- Desktop: 3 columnas -->
      <div class="mt-4 grid gap-4 max-lg:hidden lg:grid-cols-3">
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
    </template>
  </div>
</template>
