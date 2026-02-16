<script setup lang="ts">
type AuthMode = 'login' | 'register'

defineProps<{
  mode: AuthMode
}>()

const emit = defineEmits<{
  'update:mode': [value: AuthMode]
}>()
</script>

<template>
  <div class="flex rounded-full bg-slate-100 p-1 text-sm">
    <button
      type="button"
      class="flex-1 rounded-full px-3 py-2 font-medium"
      :class="mode === 'login' ? 'bg-white shadow-sm' : 'text-slate-500'"
      @click="emit('update:mode', 'login')"
    >
      Iniciar sesion
    </button>
    <button
      type="button"
      class="flex-1 rounded-full px-3 py-2 font-medium"
      :class="mode === 'register' ? 'bg-white shadow-sm' : 'text-slate-500'"
      @click="emit('update:mode', 'register')"
    >
      Crear cuenta
    </button>
  </div>
</template>
