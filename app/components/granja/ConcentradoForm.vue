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
  <div class="anim-up-2 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
        <UIcon name="lucide:shopping-bag" class="h-4 w-4" />
      </div>
      <h2 class="text-base font-semibold text-slate-900">
        Comprar Concentrado
      </h2>
    </div>

    <form
      class="flex flex-1 flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Fórmula</label>
        <UInput
          v-model="form.formula"
          placeholder="Ej: Iniciador, Engorde"
          icon="lucide:wheat"
          required
        />
      </div>

      <div class="flex gap-4">
        <div class="w-1/2 space-y-1">
          <label class="text-sm font-medium text-slate-700">Kilos</label>
          <UInput
            v-model.number="form.kilos"
            type="number"
            min="1"
            placeholder="0"
            icon="lucide:scale"
            required
          />
        </div>
        <div class="w-1/2 space-y-1">
          <label class="text-sm font-medium text-slate-700">Costo Total ($)</label>
          <UInput
            v-model.number="form.amount"
            type="number"
            min="1"
            placeholder="0.00"
            icon="lucide:circle-dollar-sign"
            required
          />
        </div>
      </div>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="warning"
          icon="lucide:check-circle"
        >
          Registrar Gasto
        </UButton>
      </div>
    </form>
  </div>
</template>
