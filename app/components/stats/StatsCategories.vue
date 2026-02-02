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
  <div class="rounded-2xl border border-slate-100 p-4">
    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
      Gastos por categoria
    </p>
    <div class="mt-4 grid gap-3">
      <div
        v-for="categoria in props.categorias"
        :key="categoria.label"
        class="grid gap-2"
      >
        <div class="flex items-center justify-between text-xs text-slate-600">
          <div class="flex items-center gap-2">
            <span
              class="h-2 w-2 rounded-full"
              :style="{ backgroundColor: categoria.color }"
            />
            <span class="truncate">{{ categoria.label }}</span>
          </div>
          <span class="font-semibold">{{ formatCurrency(categoria.value) }}</span>
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
        class="text-sm text-slate-400"
      >
        Sin gastos registrados.
      </div>
    </div>
  </div>
</template>
