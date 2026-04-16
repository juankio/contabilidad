<script setup lang="ts">
import MovementFormFields from './forms/MovementFormFields.client.vue'
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 md:col-span-2">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UIcon name="lucide:plus" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Agregar movimiento
          </h2>
          <p class="text-sm text-slate-500">
            Registra ingreso o gasto.
          </p>
        </div>
      </div>
    </div>

    <MovementFormFields />
  </div>
</template>
