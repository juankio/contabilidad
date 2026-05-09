<script setup lang="ts">
// Componente Dumb: Skeleton
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="i in 4"
      :key="i"
      class="h-14 w-full"
    >
      <USkeleton class="h-full w-full rounded-2xl" />
    </div>
  </div>
</template>
