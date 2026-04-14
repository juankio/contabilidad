<script setup lang="ts">
const emit = defineEmits<{ (e: 'submit', payload: any): void }>()

const form = reactive({
  nombreLoteMadre: '',
  cantidadInicial: 1
})

const onSubmit = () => {
  if (!form.nombreLoteMadre || form.cantidadInicial <= 0) return
  emit('submit', { ...form })
  form.nombreLoteMadre = ''
  form.cantidadInicial = 1
}
</script>

<template>
  <div class="anim-up-1 rounded-2xl border border-slate-200 bg-white p-5">
    <h2 class="text-base font-medium text-slate-900 mb-4">
      Registrar Nuevo Lote / Parto
    </h2>
    <form
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-sm text-slate-600">Nombre de la Madre / Lote</label>
        <UInput
          v-model="form.nombreLoteMadre"
          required
        />
      </div>
      <div>
        <label class="block text-sm text-slate-600">Cerditos Nacidos Vivos</label>
        <UInput
          v-model.number="form.cantidadInicial"
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
        Registrar Parto
      </UButton>
    </form>
  </div>
</template>
