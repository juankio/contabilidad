<script setup lang="ts">
defineProps<{
  title: string
  type: 'income' | 'expense'
  categories: string[]
  hiddenSet: Set<string>
  loading: boolean
  emptyMessage: string
}>()

const emit = defineEmits<{
  toggle: [type: 'income' | 'expense', category: string]
  remove: [type: 'income' | 'expense', category: string]
}>()
</script>

<template>
  <div class="grid gap-3 text-sm text-slate-600">
    <p class="font-bold text-slate-800">
      {{ title }}
    </p>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="category in categories"
        :key="`custom-${type}-${category}`"
        class="inline-flex items-center gap-0.5 rounded-xl border border-slate-200 transition-colors"
        :class="[
          hiddenSet.has(category.toLocaleLowerCase())
            ? 'bg-slate-50 text-slate-400 opacity-60 hover:opacity-100 hover:bg-slate-100'
            : type === 'income'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              : 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100'
        ]"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
          :disabled="loading"
          @click="emit('toggle', type, category)"
        >
          <UIcon
            :name="hiddenSet.has(category.toLocaleLowerCase()) ? 'lucide:eye-off' : 'lucide:eye'"
            class="h-3.5 w-3.5"
            :class="hiddenSet.has(category.toLocaleLowerCase()) ? 'text-slate-400' : (type === 'income' ? 'text-emerald-500' : 'text-rose-500')"
          />
          {{ category }}
        </button>
        <span class="h-4 w-px bg-slate-200" />
        <button
          type="button"
          class="flex items-center justify-center rounded-r-xl px-2 py-1.5 text-slate-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="loading"
          title="Eliminar categoría personalizada"
          @click="emit('remove', type, category)"
        >
          <UIcon
            name="lucide:trash-2"
            class="h-3.5 w-3.5"
          />
        </button>
      </div>
      <p
        v-if="!categories.length"
        class="text-xs text-slate-400 italic"
      >
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>
