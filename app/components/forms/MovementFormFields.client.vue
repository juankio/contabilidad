<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { animate } from 'animejs'
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

const submitBtnRef = ref(null)
let btnAnimation: any = null

onBeforeUnmount(() => {
  if (btnAnimation) btnAnimation.pause()
})

const handlePopSubmit = async () => {
  // Elastic pop effect on button
  if (submitBtnRef.value) {
    if (btnAnimation) btnAnimation.pause()
    btnAnimation = animate(submitBtnRef.value, {
      scale: [0.95, 1],
      duration: 600,
      easing: 'easeOutElastic(1, 0.5)'
    })
  }
  await submitMovement()
}
</script>

<template>
  <form
    class="mt-5 grid gap-4 relative"
    @submit.prevent="handlePopSubmit"
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
        placeholder="Selecciona un tipo"
        :aria-label="form.type || 'Selecciona un tipo'"
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
        placeholder="Selecciona una categoria"
        :aria-label="form.category || 'Selecciona una categoria'"
      />
      <UInput
        v-model="newCategoryInput"
        class="mt-2"
        type="text"
        maxlength="40"
        placeholder="Nueva categoria (opcional)"
        size="lg"
      />
      <p class="mt-1 text-xs text-slate-600">
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

    <div ref="submitBtnRef">
      <UButton
        type="submit"
        size="lg"
        color="primary"
        block
        :loading="isSaving"
        class="transition-colors shadow-sm hover:shadow-md active:scale-95"
      >
        {{ isSaving ? 'Guardando...' : 'Guardar movimiento' }}
      </UButton>
    </div>
  </form>
</template>
