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
  <div class="anim-up-2 rounded-2xl border border-slate-200 bg-white p-5">
    <h2 class="text-base font-medium text-slate-900 mb-4">
      Registrar Pago
    </h2>
    <form
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-sm text-slate-600">Trabajador</label>
        <USelect
          v-model="form.trabajadorId"
          :options="trabajadores.map(t => ({ label: t.nombre, value: t._id }))"
          required
        />
      </div>
      <div>
        <label class="block text-sm text-slate-600">Tipo de Pago</label>
        <USelect
          v-model="form.tipo"
          :options="[{ label: 'Quincena', value: 'quincena' }, { label: 'Adelanto', value: 'adelanto' }]"
          required
        />
      </div>
      <div>
        <label class="block text-sm text-slate-600">Monto</label>
        <UInput
          v-model.number="form.amount"
          type="number"
          min="1"
          required
        />
      </div>
      <UButton
        type="submit"
        block
        color="neutral"
      >
        Realizar Pago
      </UButton>
    </form>
  </div>
</template>
