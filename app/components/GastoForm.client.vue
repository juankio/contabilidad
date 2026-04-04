<script setup lang="ts">
import GastoFormFields from './forms/GastoFormFields.client.vue'

const emit = defineEmits<{
  (e: 'saved'): void
}>()
</script>

<template>
  <div class="self-start rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-4">
    <div class="mb-4 flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:plus-circle"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Agregar gasto
      </p>
    </div>

    <GastoFormFields @saved="emit('saved')" />
  </div>
</template>
