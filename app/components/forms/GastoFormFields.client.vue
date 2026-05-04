<script setup lang="ts">
import { animate, stagger } from 'animejs'

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const {
  form,
  categories,
  newCategoryInput,
  dateValue,
  amountInput,
  isSaving,
  formError,
  submitGasto
} = useGastoForm(async () => {
  emit('saved')
})

onMounted(() => {
  if (!import.meta.client) return;
  const targets = Array.from(document.querySelectorAll('.form-anim-item'))
  if (targets.length) {
    animate(targets, {
      x: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: stagger(100),
      ease: 'outQuad'
    })
  }
})
</script>

<template>
  <form
    class="gasto-form mt-5 grid gap-4"
    @submit.prevent="submitGasto"
  >
    <FormField
      class="form-anim-item"
      label="Descripcion"
      for-id="descripcion"
    >
      <UInput
        id="descripcion"
        v-model="form.description"
        class="w-full min-w-0"
        type="text"
        placeholder="Ej: Supermercado"
        size="lg"
      />
    </FormField>

    <FormField
      class="form-anim-item"
      label="Monto"
      for-id="monto"
    >
      <UInput
        id="monto"
        v-model="amountInput"
        class="w-full min-w-0"
        type="text"
        inputmode="numeric"
        placeholder="0"
        size="lg"
      />
    </FormField>

    <FormField
      class="form-anim-item"
      label="Categoria"
      for-id="categoria"
    >
      <USelect
        id="categoria"
        v-model="form.category"
        class="w-full min-w-0"
        :items="categories"
        size="lg"
        placeholder="Selecciona una categoria"
        :aria-label="form.category || 'Selecciona una categoria'"
      />
      <UInput
        v-model="newCategoryInput"
        class="mt-2 w-full min-w-0"
        type="text"
        maxlength="40"
        placeholder="Nueva categoria (opcional)"
        size="lg"
      />
      <p class="mt-1 break-words text-xs text-slate-600">
        Si escribes una categoria nueva, se guarda en el gasto y queda disponible para este perfil.
      </p>
    </FormField>

    <DateInputField
      class="form-anim-item"
      label="Fecha"
      for-id="fecha"
      :model-value="dateValue"
      @update:model-value="dateValue = $event as typeof dateValue"
    />

    <p
      v-if="formError"
      class="form-anim-item text-sm text-rose-500"
    >
      {{ formError }}
    </p>

    <UButton
      class="form-anim-item"
      type="submit"
      size="lg"
      color="primary"
      block
      :loading="isSaving"
    >
      {{ isSaving ? 'Guardando...' : 'Guardar gasto' }}
    </UButton>
  </form>
</template>

<style scoped>
@media (max-width: 640px) {
  .gasto-form :deep(input),
  .gasto-form :deep(select),
  .gasto-form :deep(textarea),
  .gasto-form :deep(button[role='combobox']) {
    font-size: 16px !important;
  }
}
</style>
