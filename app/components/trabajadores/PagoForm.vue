<script setup lang="ts">
import { toRef } from 'vue'
import FormField from '../forms/FormField.vue'
import { useMoneyInput } from '../../composables/forms/useMoneyInput'

defineProps<{
  trabajadores: any[]
}>()

const emit = defineEmits<{ (e: 'submit', payload: any): void }>()

const form = reactive({
  trabajadorId: '',
  amount: 0,
  tipo: 'quincena',
  note: ''
})

const { amountInput } = useMoneyInput(toRef(form, 'amount'))

const onSubmit = () => {
  if (!form.trabajadorId || form.amount <= 0) return
  emit('submit', { ...form })
  form.amount = 0
  form.note = ''
}
</script>

<template>
  <div class="anim-up-2 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <UIcon name="lucide:hand-coins" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Registrar Pago
          </h2>
          <p class="text-sm text-slate-500">
            Quincenas y adelantos.
          </p>
        </div>
      </div>
    </div>

    <form
      class="flex flex-1 flex-col gap-6 mt-2"
      @submit.prevent="onSubmit"
    >
      <FormField label="Trabajador" for-id="trabajador">
        <USelect
          id="trabajador"
          v-model="form.trabajadorId"
          :items="trabajadores.map(t => ({ label: t.nombre, value: t._id }))"
          icon="lucide:user"
          placeholder="Seleccionar trabajador"
          size="lg"
          required
        />
      </FormField>

      <FormField label="Tipo de Pago" for-id="tipoPago">
        <USelect
          id="tipoPago"
          v-model="form.tipo"
          :items="[{ label: 'Quincena', value: 'quincena' }, { label: 'Adelanto', value: 'adelanto' }]"
          icon="lucide:calendar-clock"
          size="lg"
          required
        />
      </FormField>

      <FormField label="Monto" for-id="monto">
        <UInput
          id="monto"
          v-model="amountInput"
          type="text"
          inputmode="numeric"
          placeholder="0"
          icon="lucide:circle-dollar-sign"
          size="lg"
          required
        />
      </FormField>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="success"
          icon="lucide:check-circle"
          size="lg"
          class="font-semibold shadow-sm"
        >
          Realizar Pago
        </UButton>
      </div>
    </form>
  </div>
</template>
