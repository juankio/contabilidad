<script setup lang="ts">
import MovementFormFields from './forms/MovementFormFields.client.vue'
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2">
    <h2 class="text-lg font-semibold">
      Agregar movimiento
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Llena los datos y guarda en segundos.
    </p>

    <MovementFormFields />
  </div>
</template>
