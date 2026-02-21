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
  <div class="grid gap-2 text-sm text-slate-600">
    <p class="font-medium">
      {{ title }}
    </p>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="category in categories"
        :key="`custom-${type}-${category}`"
        class="inline-flex items-center gap-1"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
          :class="[
            hiddenSet.has(category.toLocaleLowerCase())
              ? 'bg-slate-100 text-slate-500'
              : type === 'income'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-sky-100 text-sky-800'
          ]"
          :disabled="loading"
          @click="emit('toggle', type, category)"
        >
          {{ category }}
          <span class="font-semibold">
            {{ hiddenSet.has(category.toLocaleLowerCase()) ? 'Oculta' : 'Visible' }}
          </span>
        </button>
        <button
          type="button"
          class="rounded-full px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-rose-100 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="loading"
          @click="emit('remove', type, category)"
        >
          Eliminar
        </button>
      </div>
      <p
        v-if="!categories.length"
        class="text-xs text-slate-400"
      >
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>
