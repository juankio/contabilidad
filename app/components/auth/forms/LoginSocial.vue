<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

defineProps<{
  canUseGoogle: boolean
  googleLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'set-ref', el: HTMLElement | null): void
}>()

const googleWrapper = ref<HTMLElement | null>(null)

watch(googleWrapper, (el) => {
  emit('set-ref', el)
})

onMounted(() => {
  emit('set-ref', googleWrapper.value)
})
</script>

<template>
  <div class="anim-fade-2 mt-2 grid gap-4">
    <div class="relative text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
      <span class="relative z-10 bg-white/80 px-4 backdrop-blur-sm">o continuar con</span>
      <span class="absolute inset-x-0 top-1/2 block border-t border-slate-200/80" />
    </div>

    <div
      v-if="canUseGoogle"
      ref="googleWrapper"
      class="google-button-wrap flex justify-center"
      :class="{ 'opacity-60 pointer-events-none': googleLoading }"
    />
    <p
      v-else
      class="text-center text-xs font-medium text-slate-500"
    >
      Autenticación de Google no configurada.
    </p>
  </div>
</template>

<style scoped>
.google-button-wrap {
  min-height: 44px;
}
</style>