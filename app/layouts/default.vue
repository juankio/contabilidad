<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeaderMain from '../components/layout/AppHeaderMain.vue'
import AppFooter from '../components/layout/AppFooter.vue'

const route = useRoute()
const showHeader = computed(() => route.path !== '/login')
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeaderMain v-if="showHeader" />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter v-if="showHeader" />
  </div>
</template>
