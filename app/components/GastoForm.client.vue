<script setup lang="ts">
import GastoFormFields from './forms/GastoFormFields.client.vue'

const emit = defineEmits<{
  (e: 'saved'): void
}>()
</script>

<template>
  <div class="self-start rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md lg:col-span-4">
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:minus"
            class="h-5 w-5"
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
