<script setup lang="ts">
import AppHeaderMain from '../components/layout/AppHeaderMain.vue'

const route = useRoute()
const showHeader = computed(() => route.path !== '/login')
</script>

<template>
  <div>
    <AppHeaderMain v-if="showHeader" />

    <div class="min-h-screen">
      <slot />
    </div>
  </div>
</template>
