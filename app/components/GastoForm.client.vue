<script setup lang="ts">
import GastoFormFields from './forms/GastoFormFields.client.vue'

const emit = defineEmits<{
  (e: 'saved'): void
}>()
</script>

<template>
  <div class="self-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-4">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
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
