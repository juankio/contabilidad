<script setup lang="ts">
type CategoriaResumen = {
  category: string
  total: number
}

const { data: categorias, pending, error } = await useFetch<CategoriaResumen[]>('/api/categorias', {
  key: 'categorias'
})

const { formatCurrency } = useFormatters()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-1 lg:col-span-1">
    <h2 class="text-lg font-semibold">
      Categorias
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Organiza tus gastos para entender donde se va el dinero.
    </p>
    <div class="mt-4 grid gap-2">
      <div
        v-if="pending"
        class="text-sm text-slate-500"
      >
        Cargando categorias...
      </div>
      <div
        v-else-if="error"
        class="text-sm text-rose-500"
      >
        No se pudieron cargar.
      </div>
      <div
        v-else-if="!categorias?.length"
        class="grid min-h-44 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6"
      >
        <div class="text-center">
          <UIcon
            name="i-lucide-layout-grid"
            class="mx-auto mb-3 text-6xl text-slate-300"
          />
          <p class="text-sm text-slate-500">
            Sin gastos este mes
          </p>
        </div>
      </div>
      <template v-else>
        <div
          v-for="categoria in categorias"
          :key="categoria.category"
          class="flex items-center justify-between rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          <span>{{ categoria.category }}</span>
          <span>{{ formatCurrency(categoria.total) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
