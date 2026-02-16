<script setup lang="ts">
defineProps<{
  title: string
  type: 'income' | 'expense'
  categories: string[]
  loading: boolean
  emptyMessage: string
}>()

const emit = defineEmits<{
  remove: [type: 'income' | 'expense', category: string]
}>()
</script>

<template>
  <div class="grid gap-2 text-sm text-slate-600">
    <p class="font-medium">
      {{ title }}
    </p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="category in categories"
        :key="`custom-${type}-${category}`"
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
        :class="type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'"
        :disabled="loading"
        @click="emit('remove', type, category)"
      >
        {{ category }}
        <span
          class="font-semibold"
          :class="type === 'income' ? 'text-emerald-900/70' : 'text-sky-900/70'"
        >
          Eliminar
        </span>
      </button>
      <p
        v-if="!categories.length"
        class="text-xs text-slate-400"
      >
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>
