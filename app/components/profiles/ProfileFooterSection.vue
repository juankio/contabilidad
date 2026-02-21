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
  <p
    v-if="errorMessage"
    class="mt-3 text-sm text-red-500"
  >
    {{ errorMessage }}
  </p>

  <div class="mt-6 flex items-center justify-end gap-3">
    <UButton
      color="neutral"
      variant="ghost"
      type="button"
      :disabled="loading"
      @click="emit('cancel')"
    >
      Cancelar
    </UButton>
    <UButton
      color="neutral"
      type="button"
      :loading="loading"
      :disabled="!canSave"
      @click="emit('save')"
    >
      Guardar perfil
    </UButton>
  </div>
</template>
