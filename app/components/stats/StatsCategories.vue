<script setup lang="ts">
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
</script>

<template>
  <div class="rounded-[1.5rem] border max-sm:border-none border-slate-100/50 bg-transparent max-sm:bg-transparent p-5 max-sm:p-0 shadow-sm max-sm:shadow-none">
    <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 max-sm:hidden">
      Gastos por categoría
    </p>
    <div class="mt-4 max-sm:mt-1 grid gap-3">
      <div
        v-for="categoria in props.categorias"
        :key="categoria.label"
        class="grid gap-1.5"
      >
        <div class="flex items-center justify-between gap-2 min-w-0">
          <div class="flex min-w-0 items-center gap-2">
            <span
              class="h-2.5 w-2.5 shrink-0 rounded-full"
              :style="{ backgroundColor: categoria.color }"
            />
            <span class="truncate text-sm text-slate-700">{{ categoria.label }}</span>
          </div>
          <span class="shrink-0 text-sm font-semibold text-slate-800">{{ formatCurrency(categoria.value) }}</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full"
            :style="{
              width: `${(categoria.value / props.maxValue) * 100}%`,
              backgroundColor: categoria.color
            }"
          />
        </div>
      </div>
      <div
        v-if="!props.categorias.length"
        class="text-sm text-slate-500"
      >
        Sin gastos registrados.
      </div>
    </div>
  </div>
</template>
