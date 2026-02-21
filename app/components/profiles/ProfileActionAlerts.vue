<script setup lang="ts">
defineProps<{
  message: string
  error: string
}>()
</script>

<template>
  <div>
    <p
      v-if="message"
      class="mt-3 text-sm text-emerald-600"
    >
      {{ message }}
    </p>
    <p
      v-if="error"
      class="mt-2 text-sm text-rose-500"
    >
      {{ error }}
    </p>
  </div>
</template>
