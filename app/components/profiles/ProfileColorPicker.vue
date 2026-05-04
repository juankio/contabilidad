<script setup lang="ts">
import type { ThemeKey } from '../../composables/useTheme'

defineProps<{ color: string }>()
const emit = defineEmits<{ (e: 'update:color', key: ThemeKey): void }>()
</script>

<template>
  <div class="grid grid-cols-8 gap-2.5">
    <button
      v-for="t in THEMES"
      :key="t.key"
      type="button"
      class="color-btn relative h-8 w-8 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 ring-1 ring-inset ring-black/5 hover:ring-black/20"
      :style="{ background: t.swatch }"
      :title="t.label"
      @click="emit('update:color', t.key)"
    >
      <span
        v-if="color === t.key"
        class="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-white ring-offset-2 shadow-sm"
        :style="{ '--tw-ring-offset-color': t.swatch }"
      >
        <UIcon name="lucide:check" class="h-4 w-4 text-white" />
      </span>
    </button>
  </div>
</template>
