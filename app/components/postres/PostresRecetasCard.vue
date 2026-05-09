<script setup lang="ts">
// Orquestador principal de Recetas
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:book-open"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Recetas
          </h2>
          <p class="text-sm text-slate-500">
            Asocia insumos a postres.
          </p>
        </div>
      </div>
    </div>

    <!-- Subcomponentes extraídos -->
    <PostresRecetasForm />
    <PostresRecetasCost />
    <PostresRecetasList />
  </section>
</template>
