<script setup lang="ts">
// Orquestador principal de Ventas
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-transparent text-slate-600 ring-1 ring-slate-100">
          <UIcon name="lucide:shopping-bag" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">Ventas</h2>
          <p class="text-sm text-slate-500">Registro diario de ventas.</p>
        </div>
      </div>
    </div>

    <!-- Subcomponentes extraídos -->
    <PostresVentasForm />
    <PostresVentasList />
  </section>
</template>