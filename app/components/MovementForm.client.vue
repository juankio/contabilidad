<script setup lang="ts">
import MovementFormFields from './forms/MovementFormFields.client.vue'
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2 lg:col-span-2">
    <div class="mb-4 flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:plus-circle"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Agregar movimiento
      </p>
    </div>

    <MovementFormFields />
  </div>
</template>
