<script setup lang="ts">

const route = useRoute()
const showHeader = computed(() => route.path !== '/login')
</script>

<template>
  <div class="flex min-h-screen flex-col overflow-x-hidden w-full">
    <AppHeaderMain v-if="showHeader" />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter v-if="showHeader" />
  </div>
</template>
