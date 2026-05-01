<script setup lang="ts">
// Componente Dumb: Skeleton
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="i in 4"
      :key="i"
      class="skeleton h-14 w-full"
    />
  </div>
</template>