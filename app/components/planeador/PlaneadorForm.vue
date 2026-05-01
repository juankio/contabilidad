<script setup lang="ts">
import type { NuevoPlan } from '../../composables/planeador/usePlaneador'
import { useCalendarDateInput } from '../../composables/forms/useCalendarDateInput'
import { useMoneyInput } from '../../composables/forms/useMoneyInput'
import PlaneadorFields from './PlaneadorFields.vue'

const emit = defineEmits<{
  submit: [plan: NuevoPlan]
}>()

const props = defineProps<{
  submitting: boolean
  submitError: string | null
}>()

const toast = useToast()

watch(() => props.submitError, (newVal) => {
  if (newVal) {
    toast.add({
      title: 'No se pudo guardar',
      description: newVal,
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
})

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
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UIcon
            name="lucide:plus"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Agregar al plan
          </h2>
          <p class="text-sm text-slate-500">
            Nueva compra futura.
          </p>
        </div>
      </div>
    </div>

    <form
      class="mt-5 grid gap-4"
      @submit.prevent="onSubmit"
    >
      <PlaneadorFields
        v-model:nombre="form.nombre"
        v-model:descripcion="form.descripcion"
        v-model:amountInput="amountInput"
        v-model:fechaPlaneadaValue="fechaPlaneadaValue"
      />

      <!-- Submit -->
      <UButton
        type="submit"
        :disabled="!canSubmit"
        class="anim-up-4 mt-2"
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