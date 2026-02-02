<script setup lang="ts">
defineProps<{
  label: string
  forId: string
}>()
</script>

<template>
  <div class="grid gap-2">
    <label
      class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
      :for="forId"
    >
      {{ label }}
    </label>
    <slot />
  </div>
</template>
