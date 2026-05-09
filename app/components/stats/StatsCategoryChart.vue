<script setup lang="ts">
import { animate, stagger } from 'animejs'
import { onMounted } from 'vue'

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
  return props.categorias.map((cat) => {
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

onMounted(() => {
  if (import.meta.client) {
    // Animacion del SVG tipo "dibujo"
    animate('.anim-pie', {
      strokeDashoffset: [0, (el: HTMLElement) => el.style.getPropertyValue('--target-offset')],
      duration: 1500,
      ease: 'outQuart',
      delay: stagger(100, { start: 200 })
    })

    // Animacion de cascada para la leyenda
    animate('.anim-legend', {
      x: [20, 0],
      opacity: [0, 1],
      duration: 800,
      ease: 'outExpo',
      delay: stagger(100, { start: 300 })
    })
  }
})
</script>

<template>
  <div class="h-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 transition-all hover:shadow-md flex flex-col min-w-0 w-full">
    <h3 class="text-sm font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-2 shrink-0">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20 shadow-sm">
        <UIcon
          name="lucide:pie-chart"
          class="h-4 w-4"
        />
      </div>
      Gastos por Categoría
    </h3>

    <div
      v-if="!props.categorias.length"
      class="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3"
    >
      <UIcon
        name="lucide:ghost"
        class="h-8 w-8 opacity-50"
      />
      <span class="text-sm font-medium">Sin gastos registrados.</span>
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-8 flex-1 min-w-0 py-2"
    >
      <!-- Doughnut SVG -->
      <div class="relative h-44 w-44 shrink-0 mx-auto">
        <svg
          viewBox="0 0 42 42"
          class="h-full w-full -rotate-90 transform drop-shadow-md"
        >
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="currentColor"
            stroke-width="5"
            class="text-slate-100"
          />
          <circle
            v-for="(segment, idx) in doughnutSegments"
            :key="segment.label"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            :stroke="segment.color"
            stroke-width="5"
            :stroke-dasharray="segment.dasharray"
            :stroke-dashoffset="segment.dashoffset"
            class="anim-pie transition-all duration-700 ease-out"
            :style="{ '--target-offset': segment.dashoffset, 'stroke-dashoffset': 0 }"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span class="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total</span>
          <span class="text-base font-extrabold text-slate-900 mt-0.5 tabular-nums">{{ formatCurrency(totalValue) }}</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex flex-col gap-4 w-full flex-1 min-w-0 mt-2">
        <div
          v-for="(cat, idx) in props.categorias"
          :key="cat.label"
          class="anim-legend opacity-0 flex flex-col gap-1.5 w-full min-w-0"
        >
          <div class="flex items-center justify-between text-sm min-w-0 w-full">
            <div class="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full shadow-sm"
                :style="{ backgroundColor: cat.color }"
              />
              <span class="truncate font-semibold text-slate-700">{{ cat.label }}</span>
            </div>
            <span class="font-bold text-slate-900 shrink-0 tabular-nums text-xs sm:text-sm">{{ formatCurrency(cat.value) }}</span>
          </div>
          <!-- Mini Progress Bar inside legend -->
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
            <div
              class="h-full transition-all duration-1000 ease-out rounded-full"
              :style="{ backgroundColor: cat.color, width: `${totalValue ? (cat.value / totalValue) * 100 : 0}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
