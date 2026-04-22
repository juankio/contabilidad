<script setup lang="ts">
import FormField from '../forms/FormField.vue'
import type { LotePayload } from '../../composables/granja/useGranjaCerdos'

const emit = defineEmits<{ (e: 'submit', payload: LotePayload): void }>()

const form = reactive<LotePayload>({
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
  <div class="anim-up-1 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UIcon
            name="lucide:plus"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Registrar Lote / Parto
          </h2>
          <p class="text-sm text-slate-500">
            Añadir animales a la granja.
          </p>
        </div>
      </div>
    </div>

    <form
      class="flex flex-1 flex-col gap-6 mt-2"
      @submit.prevent="onSubmit"
    >
      <FormField
        label="Nombre de la Madre / Lote"
        for-id="nombreMadre"
      >
        <UInput
          id="nombreMadre"
          v-model="form.nombreLoteMadre"
          placeholder="Ej. Lola"
          icon="lucide:paw-print"
          size="lg"
          required
        />
      </FormField>

      <FormField
        label="Cerditos Nacidos Vivos"
        for-id="cerditosNacidos"
      >
        <UInput
          id="cerditosNacidos"
          v-model.number="form.cantidadInicial"
          type="number"
          min="1"
          placeholder="1"
          icon="lucide:hash"
          size="lg"
          required
        />
      </FormField>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          icon="lucide:check"
          size="lg"
          class="font-semibold shadow-sm"
        >
          Registrar Parto
        </UButton>
      </div>
    </form>
  </div>
</template>
