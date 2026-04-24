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
  <div class="flex relative rounded-[1rem] bg-slate-100 p-1.5 text-sm shadow-inner">
    <div
      class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-sm transition-all duration-300 ease-out"
      :class="mode === 'login' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'"
    />
    <button
      type="button"
      class="relative z-10 flex-1 rounded-xl px-4 py-2.5 font-bold transition-colors duration-200"
      :class="mode === 'login' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'"
      @click="emit('update:mode', 'login')"
    >
      Iniciar sesión
    </button>
    <button
      type="button"
      class="relative z-10 flex-1 rounded-xl px-4 py-2.5 font-bold transition-colors duration-200"
      :class="mode === 'register' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'"
      @click="emit('update:mode', 'register')"
    >
      Crear cuenta
    </button>
  </div>
</template>
