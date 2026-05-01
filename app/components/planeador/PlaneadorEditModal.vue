<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { PlanCompra, NuevoPlan } from '../../composables/planeador/usePlaneador'
import { CalendarDate } from '@internationalized/date'
import { useCalendarDateInput } from '../../composables/forms/useCalendarDateInput'
import { useMoneyInput } from '../../composables/forms/useMoneyInput'
import PlaneadorFields from './PlaneadorFields.vue'

const props = defineProps<{
  modelValue: boolean
  plan: PlanCompra | null
  submitting: boolean
  submitError: string | null | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [id: string, updates: Partial<NuevoPlan>]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
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

// Sincronizar datos cuando se abre el modal con un plan nuevo
watch(() => props.plan, (newPlan) => {
  if (newPlan) {
    form.nombre = newPlan.nombre
    form.descripcion = newPlan.descripcion || ''
    monto.value = newPlan.monto

    const [year, month] = newPlan.fechaPlaneada.split('-')
    if (year && month) {
      fechaPlaneadaValue.value = new CalendarDate(Number(year), Number(month), 1)
    }
  }
}, { immediate: true })

function toMonthKey(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 7)
  if (typeof value === 'object' && 'toString' in value) {
    return (value as { toString: () => string }).toString().slice(0, 7)
  }
  return ''
}

function onSubmit() {
  if (!canSubmit.value || !props.plan) return
  emit('submit', props.plan._id, {
    ...form,
    monto: String(monto.value),
    fechaPlaneada: fechaPlaneada.value
  })
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <ClientOnly fallback-tag="span">
    <UModal
      v-model:open="isOpen"
      :ui="{ content: 'sm:max-w-md' }"
      title="Editar plan"
      description="Actualiza los detalles de la compra."
    >
      <template #content>
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UIcon
                  name="lucide:pencil"
                  class="h-5 w-5"
                />
              </div>
              <div>
                <h2 class="text-lg font-bold tracking-tight text-slate-900">
                  Editar plan
                </h2>
                <p class="text-sm text-slate-500">
                  Actualiza los detalles de la compra.
                </p>
              </div>
            </div>
            <ClientOnly fallback-tag="span">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                class="-my-1"
                @click="close"
              />
            </ClientOnly>
          </div>

          <div
            v-if="submitError"
            class="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600"
          >
            {{ submitError }}
          </div>

          <form
            class="grid gap-4"
            @submit.prevent="onSubmit"
          >
            <PlaneadorFields
              v-model:nombre="form.nombre"
              v-model:descripcion="form.descripcion"
              v-model:amountInput="amountInput"
              v-model:fechaPlaneadaValue="fechaPlaneadaValue"
            />

            <div class="mt-4 flex justify-end gap-3">
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                @click="close"
              >
                Cancelar
              </UButton>
              <UButton
                type="submit"
                :disabled="!canSubmit"
                color="primary"
                :loading="submitting"
              >
                Guardar cambios
              </UButton>
            </div>
          </form>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>