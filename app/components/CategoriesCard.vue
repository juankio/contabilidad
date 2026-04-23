<script setup lang="ts">
type CategoriaResumen = {
  category: string
  total: number
}

const { data: categorias, pending, error } = await useFetch<CategoriaResumen[]>('/api/categorias', {
  key: 'categorias'
})

const { formatCurrency } = useFormatters()

const maxTotal = computed(() => {
  if (!categorias.value?.length) return 1
  return Math.max(...categorias.value.map(c => c.total))
})

const barColors = [
  'bg-violet-400',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-sky-400',
  'bg-rose-400',
  'bg-indigo-400',
  'bg-teal-400',
  'bg-orange-400'
]

const barClass = (index: number) => `anim-bar-${Math.min(index, 5)} ${barColors[index % barColors.length]}`
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 md:col-span-1 lg:col-span-1">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:pie-chart"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Categorías
          </h2>
          <p class="text-sm text-slate-500">
            Desglose de gastos.
          </p>
        </div>
      </div>
    </div>

    <!-- Skeleton -->
    <div
      v-if="pending"
      class="space-y-3"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="space-y-1.5"
      >
        <div class="skeleton h-3 w-24" />
        <div
          class="skeleton h-2 rounded-full"
          :style="{ width: `${60 + i * 10}%` }"
        />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-sm text-rose-500"
    >
      No se pudieron cargar.
    </div>

    <!-- Empty -->
    <div
      v-else-if="!categorias?.length"
      class="grid min-h-44 place-items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6"
    >
      <div class="text-center">
        <UIcon
          name="lucide:pie-chart"
          class="mx-auto mb-3 h-10 w-10 text-slate-200"
        />
        <p class="text-sm font-medium text-slate-400">
          Sin gastos este mes
        </p>
        <p class="mt-1 text-xs text-slate-300">
          Registra un gasto para ver el desglose.
        </p>
      </div>
    </div>

    <!-- Lista con barras -->
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="(categoria, index) in categorias"
        :key="categoria.category"
        class="group"
      >
        <div class="mb-1 flex items-center justify-between gap-2">
          <span class="truncate text-xs font-medium text-slate-600 transition-colors duration-150 group-hover:text-slate-900">
            {{ categoria.category }}
          </span>
          <span class="shrink-0 text-xs font-semibold text-slate-700">
            {{ formatCurrency(categoria.total) }}
          </span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            :class="barClass(index)"
            class="h-full rounded-full opacity-80 transition-opacity duration-200 group-hover:opacity-100"
            :style="{ width: `${Math.round((categoria.total / maxTotal) * 100)}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
