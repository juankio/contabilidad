<script setup lang="ts">
import FormField from './FormField.vue'
import DateInputField from './DateInputField.vue'

const form = reactive({
  type: 'Gasto',
  amount: 0,
  category: '',
  note: ''
})
const newCategoryInput = ref('')

const { dateValue } = useCalendarDateInput()
const { amountInput } = useMoneyInput(toRef(form, 'amount'))

const {
  activeExpenseCategories,
  activeIncomeCategories,
  refreshProfileCatalog
} = useProfile()

const expenseCategories = computed(() =>
  activeExpenseCategories.value
)

const incomeCategories = computed(() =>
  activeIncomeCategories.value
)

const categories = computed(() =>
  form.type === 'Ingreso' ? incomeCategories.value : expenseCategories.value
)

const normalizeCategory = (value: string) => value.trim().slice(0, 40)
const selectedCategory = computed(() => {
  const custom = normalizeCategory(newCategoryInput.value)
  return custom || form.category
})

watch(
  [() => form.type, incomeCategories, expenseCategories],
  ([nextType, nextIncomeCategories, nextExpenseCategories]) => {
    const list = nextType === 'Ingreso' ? nextIncomeCategories : nextExpenseCategories
    if (!list.includes(form.category)) {
      form.category = list[0] ?? ''
    }
  },
  { immediate: true }
)

const isSaving = ref(false)
const formError = ref('')
const formSuccess = ref('')

const submitMovement = async () => {
  formError.value = ''
  formSuccess.value = ''

  if (!form.note.trim()) {
    formError.value = 'Agrega una nota o descripcion.'
    return
  }

  const amount = Number(form.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    formError.value = 'Agrega un monto valido.'
    return
  }

  if (!selectedCategory.value.trim()) {
    formError.value = 'Selecciona o escribe una categoria.'
    return
  }

  isSaving.value = true

  try {
    const endpoint = form.type === 'Ingreso' ? '/api/ingresos' : '/api/gastos'
    const date = dateValue.value ? dateValue.value.toString() : undefined
    await $fetch(endpoint, {
      method: 'POST',
      body: {
        description: form.note.trim(),
        category: selectedCategory.value,
        amount,
        date
      }
    })
    await refreshProfileCatalog()
    await refreshNuxtData(['resumen', 'movimientos', 'categorias'])
    formSuccess.value = `${form.type} guardado.`
    form.amount = 0
    form.note = ''
    newCategoryInput.value = ''
  } catch {
    formError.value = 'No se pudo guardar el gasto.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await refreshProfileCatalog()
})
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
