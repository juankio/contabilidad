<script setup lang="ts">
import type { ConcentradoPayload } from '../../composables/granja/useGranjaCerdos'

const emit = defineEmits<{ (e: 'submit', payload: ConcentradoPayload): void }>()

const form = reactive<ConcentradoPayload>({
  formula: '',
  kilos: 0,
  amount: 0
})

const { amountInput } = useMoneyInput(toRef(form, 'amount'))

const onSubmit = () => {
  if (!form.formula || form.kilos <= 0 || form.amount <= 0) return
  emit('submit', { ...form })
  form.formula = ''
  form.kilos = 0
  form.amount = 0
}
</script>

<template>
  <div class="anim-up-2 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:shopping-bag"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Comprar Concentrado
          </h2>
          <p class="text-sm text-slate-500">
            Añadir bolsas o bultos.
          </p>
        </div>
      </div>
    </div>

    <form
      class="flex flex-1 flex-col gap-6 mt-2"
      @submit.prevent="onSubmit"
    >
      <FormField
        label="Fórmula"
        for-id="formula"
      >
        <UInput
          id="formula"
          v-model="form.formula"
          placeholder="Ej: Iniciador, Engorde"
          icon="lucide:wheat"
          size="lg"
          required
        />
      </FormField>

      <div class="flex gap-4">
        <FormField
          class="w-1/2"
          label="Kilos"
          for-id="kilos"
        >
          <UInput
            id="kilos"
            v-model.number="form.kilos"
            type="number"
            min="1"
            placeholder="0"
            icon="lucide:scale"
            size="lg"
            required
          />
        </FormField>

        <FormField
          class="w-1/2"
          label="Costo Total ($)"
          for-id="amount"
        >
          <UInput
            id="amount"
            v-model="amountInput"
            type="text"
            inputmode="numeric"
            placeholder="0"
            icon="lucide:circle-dollar-sign"
            size="lg"
            required
          />
        </FormField>
      </div>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          icon="lucide:check-circle"
          size="lg"
          class="font-semibold shadow-sm"
        >
          Comprar Concentrado (-COP)
        </UButton>
      </div>
    </form>
  </div>
</template>
