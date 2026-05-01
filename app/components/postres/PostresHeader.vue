<script setup lang="ts">
defineProps<{
  insumosCount: number
  postresCount: number
  ventasCount: number
  loadingData: boolean
}>()
</script>

<template>
  <header class="rounded-[2rem] border border-slate-200/60 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all mb-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="relative">
          <div class="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
            <UIcon
              name="lucide:cake"
              class="h-7 w-7 text-white"
            />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Módulo de Postres
          </h1>
          <p class="text-sm font-medium text-slate-500">
            Control de insumos, recetas y ventas.
          </p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div
        v-if="!loadingData"
        class="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide min-w-0"
      >
        <span class="shrink-0 flex items-center gap-2 rounded-xl border border-slate-200/60 bg-transparent px-4 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
          <UIcon
            name="lucide:package"
            class="h-4 w-4 text-slate-400"
          />
          {{ insumosCount }} Insumos
        </span>
        <span class="shrink-0 flex items-center gap-2 rounded-xl border border-slate-200/60 bg-transparent px-4 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
          <UIcon
            name="lucide:book-open"
            class="h-4 w-4 text-slate-400"
          />
          {{ postresCount }} Recetas
        </span>
        <span class="shrink-0 flex items-center gap-2 rounded-xl border border-slate-200/60 bg-transparent px-4 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
          <UIcon
            name="lucide:shopping-bag"
            class="h-4 w-4 text-slate-400"
          />
          {{ ventasCount }} Ventas
        </span>
      </div>
    </div>
  </header>
</template>
