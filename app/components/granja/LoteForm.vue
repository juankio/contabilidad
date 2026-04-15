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
  <div class="anim-up-1 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <UIcon name="lucide:plus" class="h-4 w-4" />
      </div>
      <h2 class="text-base font-semibold text-slate-900">
        Registrar Nuevo Lote / Parto
      </h2>
    </div>

    <form
      class="flex flex-1 flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Nombre de la Madre / Lote</label>
        <UInput
          v-model="form.nombreLoteMadre"
          placeholder="Ej. Lola"
          icon="lucide:paw-print"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Cerditos Nacidos Vivos</label>
        <UInput
          v-model.number="form.cantidadInicial"
          type="number"
          min="1"
          placeholder="1"
          icon="lucide:hash"
          required
        />
      </div>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          icon="lucide:check"
        >
          Registrar Parto
        </UButton>
      </div>
    </form>
  </div>
</template>
