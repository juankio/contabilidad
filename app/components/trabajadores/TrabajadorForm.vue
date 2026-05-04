<script setup lang="ts">
import type { TrabajadorPayload } from '../../composables/trabajadores/useTrabajadores'

const emit = defineEmits<{ (e: 'submit', payload: TrabajadorPayload): void }>()

const form = reactive<TrabajadorPayload>({
  nombre: '',
  cargo: '',
  salario: 0
})

const onSubmit = () => {
  if (!form.nombre || !form.cargo || form.salario <= 0) return
  emit('submit', { ...form })
  form.nombre = ''
  form.cargo = ''
  form.salario = 0
}
</script>

<template>
  <div class="anim-up-1 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:user-plus"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Añadir Trabajador
          </h2>
          <p class="text-sm text-slate-500">
            Registra nuevo personal.
          </p>
        </div>
      </div>
    </div>

    <form
      class="flex flex-1 flex-col gap-6 mt-2"
      @submit.prevent="onSubmit"
    >
      <TrabajadorFormFields
        v-model:nombre="form.nombre"
        v-model:cargo="form.cargo"
        v-model:salario="form.salario"
      />

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          icon="lucide:plus"
          size="lg"
          class="font-semibold shadow-sm"
        >
          Crear trabajador
        </UButton>
      </div>
    </form>
  </div>
</template>
