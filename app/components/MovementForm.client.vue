<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const form = reactive({
  type: 'Gasto',
  amount: 0,
  category: 'Alimentacion',
  note: ''
})

const inputDate = useTemplateRef('inputDate')
const today = new Date()
const dateValue = shallowRef(
  new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
)

const formatAmount = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)

const parseAmountInput = (value: string) => {
  const numeric = value.replace(/[^\d]/g, '')
  return numeric ? Number(numeric) : 0
}

const amountInput = computed({
  get() {
    return form.amount ? formatAmount(form.amount) : ''
  },
  set(value: string) {
    form.amount = parseAmountInput(value)
  }
})

const expenseCategories = [
  'Alimentacion',
  'Servicios',
  'Transporte',
  'Salud',
  'Otros'
]

const incomeCategories = [
  'Ventas',
  'Salario',
  'Servicios',
  'Otros'
]

const categories = computed(() =>
  form.type === 'Ingreso' ? incomeCategories : expenseCategories
)

watch(
  () => form.type,
  (nextType) => {
    form.category = (nextType === 'Ingreso' ? incomeCategories[0] : expenseCategories[0]) ?? 'Otros'
  }
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

  isSaving.value = true

  try {
    const endpoint = form.type === 'Ingreso' ? '/api/ingresos' : '/api/gastos'
    const date = dateValue.value ? dateValue.value.toString() : undefined
    await $fetch(endpoint, {
      method: 'POST',
      body: {
        description: form.note.trim(),
        category: form.category,
        amount,
        date
      }
    })
    await refreshNuxtData(['resumen', 'movimientos', 'categorias'])
    formSuccess.value = `${form.type} guardado.`
    form.amount = 0
    form.note = ''
  } catch {
    formError.value = 'No se pudo guardar el gasto.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2">
    <h2 class="text-lg font-semibold">
      Agregar movimiento
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Llena los datos y guarda en segundos.
    </p>

    <form
      class="mt-5 grid gap-4"
      @submit.prevent="submitMovement"
    >
      <div class="grid gap-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          for="tipo"
        >
          Tipo
        </label>
        <USelect
          id="tipo"
          v-model="form.type"
          :items="['Gasto', 'Ingreso']"
          size="lg"
        />
      </div>

      <div class="grid gap-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          for="monto"
        >
          Monto
        </label>
        <UInput
          id="monto"
          v-model="amountInput"
          type="text"
          inputmode="numeric"
          placeholder="0"
          size="lg"
        />
      </div>

      <div class="grid gap-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          for="categoria"
        >
          Categoria
        </label>
        <USelect
          id="categoria"
          v-model="form.category"
          :items="categories"
          size="lg"
        />
      </div>

      <div class="grid gap-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          for="fecha"
        >
          Fecha
        </label>
        <UInputDate
          ref="inputDate"
          v-model="dateValue"
        >
          <template #trailing>
            <UPopover :reference="inputDate?.inputsRef[3]?.$el">
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-calendar"
                aria-label="Selecciona una fecha"
                class="px-0"
              />
              <template #content>
                <UCalendar
                  v-model="dateValue"
                  class="p-2"
                />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </div>

      <div class="grid gap-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          for="nota"
        >
          Nota
        </label>
        <UInput
          id="nota"
          v-model="form.note"
          type="text"
          placeholder="Ej: Supermercado"
          size="lg"
        />
      </div>

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
  </div>
</template>
