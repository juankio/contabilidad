<script setup lang="ts">
import { computed } from 'vue'

type CategoriaSegment = {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  categorias: CategoriaSegment[]
  maxValue: number
}>()

const { formatCurrency } = useFormatters()

const totalValue = computed(() => {
  return props.categorias.reduce((acc, cat) => acc + cat.value, 0)
})

const doughnutSegments = computed(() => {
  let accumulatedPercent = 0
  return props.categorias.map(cat => {
    const percent = totalValue.value ? (cat.value / totalValue.value) * 100 : 0
    const segment = {
      ...cat,
      percent,
      dasharray: `${percent} 100`,
      dashoffset: -accumulatedPercent
    }
    accumulatedPercent += percent
    return segment
  })
})
</script>

<template>
  <div class="h-full rounded-[2rem] border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md flex flex-col min-w-0">
    <h3 class="text-sm font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
      <UIcon name="lucide:pie-chart" class="h-4 w-4 text-[var(--brand-500)]" />
      Gastos por Categoría
    </h3>
    
    <div v-if="!props.categorias.length" class="flex-1 flex items-center justify-center text-sm text-slate-500">
      Sin gastos registrados.
    </div>

    <div v-else class="flex flex-col sm:flex-row items-center gap-8 flex-1 min-w-0">
      <!-- Doughnut SVG -->
      <div class="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 42 42" class="h-full w-full -rotate-90 transform drop-shadow-sm">
          <circle
            cx="21" cy="21" r="15.91549430918954"
            fill="transparent"
            stroke="currentColor"
            stroke-width="6"
            class="text-slate-100"
          />
          <circle
            v-for="segment in doughnutSegments"
            :key="segment.label"
            cx="21" cy="21" r="15.91549430918954"
            fill="transparent"
            :stroke="segment.color"
            stroke-width="6"
            :stroke-dasharray="segment.dasharray"
            :stroke-dashoffset="segment.dashoffset"
            class="transition-all duration-700 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span class="text-xs font-semibold text-slate-400">Total</span>
          <span class="text-sm font-bold text-slate-800">{{ formatCurrency(totalValue) }}</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="grid gap-3 w-full flex-1">
        <div
          v-for="cat in props.categorias"
          :key="cat.label"
          class="flex items-center justify-between gap-3 text-sm"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span class="h-3 w-3 shrink-0 rounded-full shadow-sm" :style="{ backgroundColor: cat.color }" />
            <span class="truncate font-medium text-slate-600">{{ cat.label }}</span>
          </div>
          <span class="font-bold text-slate-900 shrink-0">{{ formatCurrency(cat.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
