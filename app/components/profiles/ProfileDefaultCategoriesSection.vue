<script setup lang="ts">
defineProps<{
  title: string
  type: 'income' | 'expense'
  categories: string[]
  hiddenSet: Set<string>
}>()

const emit = defineEmits<{
  toggle: [type: 'income' | 'expense', category: string]
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
        :key="`${type}-${category}`"
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
        :class="[
          hiddenSet.has(category.toLocaleLowerCase())
            ? 'bg-slate-100 text-slate-500'
            : type === 'income'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-sky-50 text-sky-700'
        ]"
        @click="emit('toggle', type, category)"
      >
        {{ category }}
        <span class="font-semibold">
          {{ hiddenSet.has(category.toLocaleLowerCase()) ? 'Oculta' : 'Visible' }}
        </span>
      </button>
    </div>
  </div>
</template>
