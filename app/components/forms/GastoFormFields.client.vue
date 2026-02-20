<script setup lang="ts">
import FormField from './FormField.vue'
import DateInputField from './DateInputField.vue'
import { useGastoForm } from '../../composables/forms/useGastoForm'

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
</script>

<template>
  <form
    class="gasto-form mt-5 grid gap-4"
    @submit.prevent="submitGasto"
  >
    <FormField
      label="Descripcion"
      for-id="descripcion"
    >
      <UInput
        class="w-full min-w-0"
        id="descripcion"
        v-model="form.description"
        type="text"
        placeholder="Ej: Supermercado"
        size="lg"
      />
    </FormField>

    <FormField
      label="Monto"
      for-id="monto"
    >
      <UInput
        class="w-full min-w-0"
        id="monto"
        v-model="amountInput"
        type="text"
        inputmode="numeric"
        placeholder="0"
        size="lg"
      />
    </FormField>

    <FormField
      label="Categoria"
      for-id="categoria"
    >
      <USelect
        class="w-full min-w-0"
        id="categoria"
        v-model="form.category"
        :items="categories"
        size="lg"
      />
      <UInput
        v-model="newCategoryInput"
        class="mt-2 w-full min-w-0"
        type="text"
        maxlength="40"
        placeholder="Nueva categoria (opcional)"
        size="lg"
      />
      <p class="mt-1 break-words text-xs text-slate-500">
        Si escribes una categoria nueva, se guarda en el gasto y queda disponible para este perfil.
      </p>
    </FormField>

    <DateInputField
      label="Fecha"
      for-id="fecha"
      :model-value="dateValue"
      @update:model-value="dateValue = $event as typeof dateValue"
    />

    <p
      v-if="formError"
      class="text-sm text-rose-500"
    >
      {{ formError }}
    </p>

    <UButton
      type="submit"
      size="lg"
      color="success"
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
