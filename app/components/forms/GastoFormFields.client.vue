<script setup lang="ts">
import FormField from './FormField.vue'
import DateInputField from './DateInputField.vue'

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const form = reactive({
  description: '',
  category: 'Alimentacion',
  amount: 0
})

const { dateValue } = useCalendarDateInput()
const { amountInput } = useMoneyInput(toRef(form, 'amount'))

const categories = [
  'Alimentacion',
  'Servicios',
  'Transporte',
  'Salud',
  'Otros'
]

const isSaving = ref(false)
const formError = ref('')

const submitGasto = async () => {
  formError.value = ''

  if (!form.description.trim()) {
    formError.value = 'Agrega una descripcion.'
    return
  }

  const amount = Number(form.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    formError.value = 'Agrega un monto valido.'
    return
  }

  isSaving.value = true

  try {
    const date = dateValue.value ? dateValue.value.toString() : undefined
    await $fetch('/api/gastos', {
      method: 'POST',
      body: {
        description: form.description.trim(),
        category: form.category,
        amount,
        date
      }
    })
    emit('saved')
    form.description = ''
    form.amount = 0
  } catch {
    formError.value = 'No se pudo guardar el gasto.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form
    class="mt-5 grid gap-4"
    @submit.prevent="submitGasto"
  >
    <FormField
      label="Descripcion"
      for-id="descripcion"
    >
      <UInput
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
