<script setup lang="ts">
import type { NuevoPlan } from '../../composables/planeador/usePlaneador'
import DateInputField from '../forms/DateInputField.vue'
import FormField from '../forms/FormField.vue'
import { useCalendarDateInput } from '../../composables/forms/useCalendarDateInput'
import { useMoneyInput } from '../../composables/forms/useMoneyInput'

const emit = defineEmits<{
  submit: [plan: NuevoPlan]
}>()

const props = defineProps<{
  submitting: boolean
  submitError: string | null
}>()

type PlaneadorFormValues = Omit<NuevoPlan, 'fechaPlaneada'>

const form = reactive<PlaneadorFormValues>({
  nombre: '',
  monto: '0',
  descripcion: ''
})
const { dateValue: fechaPlaneadaValue } = useCalendarDateInput()
const monto = ref(0)
const { amountInput } = useMoneyInput(monto)

const fechaPlaneada = computed(() => toMonthKey(fechaPlaneadaValue.value))

const canSubmit = computed(() =>
  form.nombre.trim().length > 0
  && monto.value > 0
  && fechaPlaneada.value.length === 7
  && !props.submitting
)

function reset() {
  form.nombre = ''
  monto.value = 0
  form.monto = '0'
  form.descripcion = ''
}

function onSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    ...form,
    monto: String(monto.value),
    fechaPlaneada: fechaPlaneada.value
  })
}

function toMonthKey(value: unknown): string {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value.slice(0, 7)
  }

  if (typeof value === 'object' && 'toString' in value) {
    return (value as { toString: () => string }).toString().slice(0, 7)
  }

  return ''
}

defineExpose({ reset })
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="anim-up mb-4">
      <div class="flex items-center gap-2 text-slate-700">
        <UIcon
          name="lucide:plus-circle"
          class="h-4 w-4"
        />
        <p class="text-sm font-semibold">
          Nueva compra
        </p>
      </div>
      <p class="mt-1 text-xs text-slate-400">
        Nueva compra
      </p>
      <h2 class="mt-0.5 text-2xl font-bold text-slate-900">
        Agregar al plan
      </h2>
    </div>

    <form
      class="mt-5 grid gap-4"
      @submit.prevent="onSubmit"
    >
      <FormField
        label="¿Qué quieres comprar?"
        for-id="planeador-nombre"
        class="anim-up-1"
      >
        <UInput
          id="planeador-nombre"
          v-model="form.nombre"
          type="text"
          placeholder="Ej: Zapatos, celular, viaje..."
          maxlength="80"
          size="lg"
        />
      </FormField>

      <div class="anim-up-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Cuánto cuesta"
          for-id="planeador-monto"
        >
          <UInput
            id="planeador-monto"
            v-model="amountInput"
            type="text"
            inputmode="numeric"
            placeholder="0"
            size="lg"
          />
        </FormField>

        <DateInputField
          label="¿Para cuándo?"
          for-id="planeador-fecha"
          :model-value="fechaPlaneadaValue"
          @update:model-value="fechaPlaneadaValue = $event as typeof fechaPlaneadaValue"
        />
      </div>

      <FormField
        label="Nota"
        for-id="planeador-descripcion"
        class="anim-up-3"
      >
        <UInput
          id="planeador-descripcion"
          v-model="form.descripcion"
          type="text"
          placeholder="Por qué lo necesitas, dónde comprarlo..."
          maxlength="200"
          size="lg"
        />
      </FormField>

      <!-- Error -->
      <Transition name="slide-down">
        <p
          v-if="submitError"
          class="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600"
        >
          {{ submitError }}
        </p>
      </Transition>

      <!-- Submit -->
      <UButton
        type="submit"
        :disabled="!canSubmit"
        class="anim-up-4"
        size="lg"
        color="primary"
        block
        :loading="submitting"
      >
        {{ submitting ? 'Guardando...' : 'Agregar al planeador' }}
      </UButton>
    </form>
  </div>
</template>

<style scoped>
/* Error slide */
.slide-down-enter-active { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-down-leave-active { transition: all 0.15s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-6px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
