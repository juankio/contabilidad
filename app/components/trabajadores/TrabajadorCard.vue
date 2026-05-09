<script setup lang="ts">
import type { Trabajador } from '../../composables/trabajadores/useTrabajadores'

const props = defineProps<{
  trabajador: Trabajador
  formatCurrency: (value: number) => string
}>()

const emit = defineEmits<{
  (e: 'edit', trabajador: Trabajador): void
  (e: 'delete', trabajador: Trabajador): void
}>()

const getDropdownItems = () => [
  [{
    label: 'Editar',
    icon: 'lucide:pencil',
    onSelect: () => emit('edit', props.trabajador)
  }],
  [{
    label: 'Eliminar',
    icon: 'lucide:trash-2',
    color: 'error',
    onSelect: () => emit('delete', props.trabajador)
  }]
]
</script>

<template>
  <div class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-transparent p-4 transition-colors hover:bg-transparent">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <span class="text-sm font-bold text-primary">{{ trabajador.nombre.charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <p class="font-semibold text-slate-900 line-clamp-1">
            {{ trabajador.nombre }}
          </p>
          <p class="text-xs text-slate-500">
            {{ trabajador.cargo }}
          </p>
        </div>
      </div>
      <UDropdownMenu
        :items="getDropdownItems()"
        :popper="{ placement: 'bottom-end' }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="lucide:more-vertical"
          class="text-slate-400 hover:text-slate-600"
        />
      </UDropdownMenu>
    </div>

    <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
      <span class="text-xs text-slate-500">Salario base</span>
      <p class="text-sm font-semibold text-slate-900">
        {{ formatCurrency(trabajador.salario) }}
      </p>
    </div>
  </div>
</template>
