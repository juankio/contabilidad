<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const form = reactive({
  description: '',
  category: 'Alimentacion',
  amount: 0
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
  <div class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-4">
    <h2 class="text-lg font-semibold">
      Agregar gasto
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Elige la fecha desde el calendario.
    </p>

    <form
      class="mt-5 grid gap-4"
      @submit.prevent="submitGasto"
    >
      <div class="grid gap-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          for="descripcion"
        >
          Descripcion
        </label>
        <UInput
          id="descripcion"
          v-model="form.description"
          type="text"
          placeholder="Ej: Supermercado"
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
  </div>
</template>
