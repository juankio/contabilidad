<script setup lang="ts">
const emit = defineEmits<{ (e: 'submit', payload: any): void }>()

const form = reactive({
  formula: '',
  kilos: 0,
  amount: 0
})

const onSubmit = () => {
  if (!form.formula || form.amount <= 0) return
  emit('submit', { ...form })
  form.formula = ''
  form.kilos = 0
  form.amount = 0
}
</script>

<template>
  <div class="anim-up-2 rounded-2xl border border-slate-200 bg-white p-5">
    <h2 class="text-base font-medium text-slate-900 mb-4">
      Comprar Concentrado
    </h2>
    <form
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-sm text-slate-600">Fórmula (Ej: Iniciador, Engorde)</label>
        <UInput
          v-model="form.formula"
          required
        />
      </div>
      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="block text-sm text-slate-600">Kilos</label>
          <UInput
            v-model.number="form.kilos"
            type="number"
            min="1"
            required
          />
        </div>
        <div class="w-1/2">
          <label class="block text-sm text-slate-600">Costo Total ($)</label>
          <UInput
            v-model.number="form.amount"
            type="number"
            min="1"
            required
          />
        </div>
      </div>
      <UButton
        type="submit"
        block
        color="neutral"
      >
        Registrar Gasto
      </UButton>
    </form>
  </div>
</template>
