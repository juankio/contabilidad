<script setup lang="ts">
import GastoFormFields from './forms/GastoFormFields.client.vue'

const emit = defineEmits<{
  (e: 'saved'): void
}>()
</script>

<template>
  <div class="self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <UIcon name="lucide:plus" class="h-4 w-4" />
      </div>
      <h2 class="text-base font-semibold text-slate-900">
        Agregar gasto
      </h2>
    </div>

    <GastoFormFields @saved="emit('saved')" />
  </div>
</template>
