<script setup lang="ts">
const emit = defineEmits<{
  (e: 'saved'): void
}>()
</script>

<template>
  <div class="self-start rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 lg:col-span-4">
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:receipt"
            class="h-6 w-6"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Agregar gasto
          </h2>
          <p class="text-sm text-slate-500">
            Registra un nuevo egreso.
          </p>
        </div>
      </div>
    </div>

    <GastoFormFields @saved="emit('saved')" />
  </div>
</template>
