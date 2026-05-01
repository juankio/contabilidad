<script setup lang="ts">
defineProps<{
  name: string
  icon: string
  swatch: string
}>()
</script>

<template>
  <div class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-transparent px-4 py-3">
    <div
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300"
      :style="{ background: swatch }"
    >
      <UIcon
        :name="icon || 'i-lucide-user'"
        class="h-5 w-5 text-white"
      />
    </div>
    <div class="min-w-0">
      <p class="truncate text-sm font-semibold text-slate-900">
        {{ name || 'Sin nombre' }}
      </p>
      <p class="text-xs text-slate-400">
        Vista previa del perfil
      </p>
    </div>
    <span
      class="ml-auto h-3 w-3 shrink-0 rounded-full ring-2 ring-white ring-offset-1"
      :style="{ background: swatch }"
    />
  </div>
</template>
