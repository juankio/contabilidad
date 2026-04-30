<script setup lang="ts">
import MovementFormFields from './forms/MovementFormFields.client.vue'
</script>

<template>
  <div class="rounded-[2rem] border border-white/60 bg-white/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 min-w-0">
    <div class="mb-6 flex items-start justify-between min-w-0">
      <div class="flex items-center gap-4 min-w-0">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:plus"
            class="h-5 w-5"
          />
        </div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold tracking-tight text-slate-900 truncate">
            Nuevo movimiento
          </h2>
          <p class="text-sm text-slate-500 truncate">
            Registra rápido
          </p>
        </div>
      </div>
    </div>

    <MovementFormFields />
  </div>
</template>
