<script setup lang="ts">
import type { ThemeKey } from '../../composables/useTheme'

defineProps<{ activeColor: string, saving: boolean }>()
const emit = defineEmits<{ (e: 'select', key: ThemeKey): void }>()
</script>

<template>
  <div class="grid grid-cols-8 gap-2">
    <button
      v-for="t in THEMES"
      :key="t.key"
      type="button"
      class="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
      :style="{ background: t.swatch }"
      :title="t.label"
      :disabled="saving"
      @click="emit('select', t.key)"
    >
      <span
        v-if="activeColor === t.key"
        class="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-white ring-offset-2"
        :style="{ '--tw-ring-offset-color': t.swatch }"
      >
        <svg
          class="h-3 w-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    </button>
  </div>
</template>
