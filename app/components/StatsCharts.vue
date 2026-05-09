<script setup lang="ts">
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
          <UIcon
            name="lucide:activity"
            class="h-5 w-5"
          />
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

    <!-- Charts Grid -->
    <div class="grid gap-6 xl:grid-cols-2 mt-2">
      <!-- Loading State (Skeletons) -->
      <template v-if="pending">
        <!-- Skeleton Tendencia -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-w-0 w-full min-h-[350px]">
          <div class="flex items-center gap-2 mb-6">
            <USkeleton class="h-4 w-4 rounded" />
            <USkeleton class="h-4 w-32 rounded" />
          </div>
          <div class="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-100 flex-1 min-w-0">
            <div class="flex flex-col justify-center pr-0 lg:pr-6">
              <USkeleton class="h-3 w-16 rounded mb-2" />
              <USkeleton class="h-8 w-40 rounded mb-6" />
              <USkeleton class="h-4 w-full rounded-full mb-6" />
              <div class="grid gap-3">
                <USkeleton class="h-12 w-full rounded-xl" />
                <USkeleton class="h-12 w-full rounded-xl" />
              </div>
            </div>
            <div class="flex flex-col justify-end pl-0 pt-8 mt-2 lg:mt-0 lg:pt-0 lg:pl-6 border-t lg:border-t-0 border-slate-100">
              <USkeleton class="h-3 w-24 rounded mb-6" />
              <div class="flex h-36 items-end justify-between gap-1 sm:gap-2">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="flex-1 flex justify-center h-full items-end"
                >
                  <USkeleton class="h-[60%] w-3 rounded-t-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Categorias -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-w-0 w-full min-h-[350px]">
          <div class="flex items-center gap-2 mb-6">
            <USkeleton class="h-4 w-4 rounded" />
            <USkeleton class="h-4 w-32 rounded" />
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 flex-1 min-w-0 py-4 sm:py-0">
            <USkeleton class="relative h-40 w-40 shrink-0 rounded-full" />
            <div class="grid gap-3 w-full flex-1 min-w-0">
              <div
                v-for="i in 4"
                :key="i"
                class="flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-2">
                  <USkeleton class="h-3 w-3 rounded-full" />
                  <USkeleton class="h-4 w-24 rounded" />
                </div>
                <USkeleton class="h-4 w-16 rounded" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="error">
        <div class="xl:col-span-2 flex h-64 flex-col items-center justify-center gap-2 rounded-3xl border border-rose-200 bg-rose-50 text-rose-500">
          <UIcon
            name="lucide:alert-circle"
            class="h-6 w-6"
          />
          <span class="text-sm font-medium">Error al cargar estadísticas</span>
        </div>
      </template>

      <!-- Success State -->
      <template v-else>
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
      </template>
    </div>
  </div>
</template>
