<script setup lang="ts">
defineProps<{
  onLogout: () => void
}>()
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
        Perfiles
      </p>
      <h1 class="text-2xl font-semibold">
        Selecciona un perfil
      </h1>
    </div>
    <UButton
      variant="outline"
      color="neutral"
      size="sm"
      @click="onLogout"
    >
      Cerrar sesion
    </UButton>
  </header>
</template>
