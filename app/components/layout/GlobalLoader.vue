<script setup lang="ts">
const isReady = ref(false)

onMounted(() => {
  // Damos un pequeño respiro de 500ms para asegurar que los componentes .client.vue
  // terminen de montarse antes de ocultar la pantalla de carga.
  setTimeout(() => {
    isReady.value = true
  }, 500)
})
</script>

<template>
  <Transition name="splash">
    <div
      v-if="!isReady"
      class="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-50/95 backdrop-blur-md"
    >
      <div class="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--brand-500)] text-white shadow-2xl shadow-[var(--brand-500)]/30 animate-bounce-subtle">
        <UIcon
          name="lucide:wallet"
          class="h-12 w-12"
        />
        <div class="absolute inset-0 rounded-3xl ring-2 ring-white/20"></div>
      </div>
      <h1 class="mt-8 text-2xl font-extrabold tracking-tight text-slate-900">
        Mi Contabilidad
      </h1>
      <p class="mt-2 text-sm font-medium text-slate-500 animate-pulse">
        Cargando módulos...
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.splash-enter-active,
.splash-leave-active {
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.splash-enter-from,
.splash-leave-to {
  opacity: 0;
  filter: blur(12px);
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(-5%);
  }
  50% {
    transform: translateY(5%);
  }
}
</style>
