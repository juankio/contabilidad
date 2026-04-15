<script setup lang="ts">
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

const onSubmit = () => {
  if (!form.trabajadorId || form.amount <= 0) return
  emit('submit', { ...form })
  form.amount = 0
  form.note = ''
}
</script>

<template>
  <div class="anim-up-2 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
        <UIcon name="lucide:hand-coins" class="h-4 w-4" />
      </div>
      <h2 class="text-base font-semibold text-slate-900">
        Registrar Pago
      </h2>
    </div>

    <form
      class="flex flex-1 flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Trabajador</label>
        <USelect
          v-model="form.trabajadorId"
          :options="trabajadores.map(t => ({ label: t.nombre, value: t._id }))"
          icon="lucide:user"
          placeholder="Seleccionar trabajador"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Tipo de Pago</label>
        <USelect
          v-model="form.tipo"
          :options="[{ label: 'Quincena', value: 'quincena' }, { label: 'Adelanto', value: 'adelanto' }]"
          icon="lucide:calendar-clock"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Monto</label>
        <UInput
          v-model.number="form.amount"
          type="number"
          min="1"
          placeholder="0.00"
          icon="lucide:circle-dollar-sign"
          required
        />
      </div>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="success"
          icon="lucide:check-circle"
        >
          Realizar Pago
        </UButton>
      </div>
    </form>
  </div>
</template>
