<script setup lang="ts">
import FormField from './FormField.vue'
import DateInputField from './DateInputField.vue'
import { useMovementForm } from '../../composables/forms/useMovementForm'

const {
  form,
  categories,
  newCategoryInput,
  dateValue,
  amountInput,
  isSaving,
  formError,
  formSuccess,
  submitMovement
} = useMovementForm()
</script>

<template>
  <form
    class="mt-5 grid gap-4"
    @submit.prevent="submitMovement"
  >
    <FormField
      label="Tipo"
      for-id="tipo"
    >
      <USelect
        id="tipo"
        v-model="form.type"
        :items="['Gasto', 'Ingreso']"
        size="lg"
      />
    </FormField>

    <FormField
      label="Monto"
      for-id="monto"
    >
      <UInput
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
        id="categoria"
        v-model="form.category"
        :items="categories"
        size="lg"
      />
      <UInput
        v-model="newCategoryInput"
        class="mt-2"
        type="text"
        maxlength="40"
        placeholder="Nueva categoria (opcional)"
        size="lg"
      />
      <p class="mt-1 text-xs text-slate-500">
        Si escribes una categoria nueva, se guarda en el movimiento y queda disponible para este perfil.
      </p>
    </FormField>

    <DateInputField
      label="Fecha"
      for-id="fecha"
      :model-value="dateValue"
      @update:model-value="dateValue = $event as typeof dateValue"
    />

    <FormField
      label="Nota"
      for-id="nota"
    >
      <UInput
        id="nota"
        v-model="form.note"
        type="text"
        placeholder="Ej: Supermercado"
        size="lg"
      />
    </FormField>

    <p
      v-if="formError"
      class="text-sm text-rose-500"
    >
      {{ formError }}
    </p>
    <p
      v-if="formSuccess"
      class="text-sm text-emerald-600"
    >
      {{ formSuccess }}
    </p>

    <UButton
      type="submit"
      size="lg"
      color="success"
      block
      :loading="isSaving"
    >
      {{ isSaving ? 'Guardando...' : 'Guardar movimiento' }}
    </UButton>
  </form>
</template>
