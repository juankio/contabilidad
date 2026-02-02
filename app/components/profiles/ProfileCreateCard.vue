<script setup lang="ts">
defineProps<{
  modelValue: string
  loading: boolean
  errorMessage: string
  onSubmit: () => void
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <UCard class="border border-dashed border-slate-200 bg-slate-50">
    <p class="text-sm font-semibold text-slate-700">
      Nuevo perfil
    </p>
    <UInput
      :model-value="modelValue"
      type="text"
      placeholder="Nombre"
      size="lg"
      class="mt-3"
      @update:model-value="emit('update:modelValue', $event)"
      @keydown.enter.prevent="onSubmit"
    />
    <UButton
      class="mt-3"
      color="neutral"
      size="lg"
      block
      :loading="loading"
      @click="onSubmit"
    >
      Agregar
    </UButton>
    <p
      v-if="errorMessage"
      class="mt-2 text-xs text-red-500"
    >
      {{ errorMessage }}
    </p>
  </UCard>
</template>
