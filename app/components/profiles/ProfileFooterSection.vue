<script setup lang="ts">
defineProps<{
  errorMessage: string
  loading: boolean
  canSave: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel' | 'save'): void
}>()
</script>

<template>
  <div class="mt-6 flex items-center justify-end gap-3">
    <UButton
      color="neutral"
      variant="ghost"
      icon="lucide:x"
      type="button"
      :disabled="loading"
      @click="emit('cancel')"
    >
      Cancelar
    </UButton>
    <UButton
      color="primary"
      icon="lucide:save"
      type="button"
      :loading="loading"
      :disabled="!canSave"
      @click="emit('save')"
    >
      Guardar perfil
    </UButton>
  </div>
</template>
