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
  <div class="grid gap-3 text-sm text-slate-600">
    <p class="font-bold text-slate-800">
      {{ title }}
    </p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="category in categories"
        :key="`${type}-${category}`"
        type="button"
        class="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-colors hover:shadow-sm"
        :class="[
          hiddenSet.has(category.toLocaleLowerCase())
            ? 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 hover:opacity-100 hover:bg-slate-100'
            : type === 'income'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
        ]"
        @click="emit('toggle', type, category)"
      >
        <UIcon
          :name="hiddenSet.has(category.toLocaleLowerCase()) ? 'lucide:eye-off' : 'lucide:eye'"
          class="h-3.5 w-3.5"
          :class="hiddenSet.has(category.toLocaleLowerCase()) ? 'text-slate-400' : (type === 'income' ? 'text-emerald-500' : 'text-rose-500')"
        />
        {{ category }}
      </button>
    </div>
  </div>
</template>
