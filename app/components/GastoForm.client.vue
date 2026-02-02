<script setup lang="ts">
import GastoFormFields from './forms/GastoFormFields.client.vue'

const emit = defineEmits<{
  (e: 'saved'): void
}>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-4">
    <h2 class="text-lg font-semibold">
      Agregar gasto
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Elige la fecha desde el calendario.
    </p>

    <GastoFormFields @saved="emit('saved')" />
  </div>
</template>
