<script setup lang="ts">
definePageMeta({ requiresModule: 'prestamos' })

useSeoMeta({
  title: 'Préstamos | Mi App',
  description: 'Gestiona lo que prestas y lo que te deben.'
})
</script>

<template>
  <PrestamosFeature />
</template>
