<script setup lang="ts">
import type { Trabajador } from '../../composables/trabajadores/useTrabajadores'

const props = defineProps<{
  trabajadores: Trabajador[]
  loading: boolean
  formatCurrency: (value: number) => string
}>()

const emit = defineEmits<{
  (e: 'edit', trabajador: Trabajador): void
  (e: 'delete', trabajador: Trabajador): void
}>()

const getDropdownItems = (t: Trabajador) => [
  [{
    label: 'Editar',
    icon: 'lucide:pencil',
    onSelect: () => emit('edit', t)
  }],
  [{
    label: 'Eliminar',
    icon: 'lucide:trash-2',
    color: 'error',
    onSelect: () => emit('delete', t)
  }]
]
</script>

<template>
  <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <UIcon
            name="lucide:users"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Plantilla Actual
          </h2>
          <p class="text-sm text-slate-500">
            Personal activo de la empresa.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <USkeleton class="h-10 w-10 shrink-0 rounded-xl" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-3 w-16" />
            </div>
          </div>
          <USkeleton class="h-8 w-8 rounded-lg" />
        </div>
        <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
          <USkeleton class="h-3 w-16" />
          <USkeleton class="h-4 w-20" />
        </div>
      </div>
    </div>
    <div
      v-else-if="trabajadores.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
    >
      <UIcon
        name="lucide:inbox"
        class="mb-2 h-8 w-8 text-slate-300"
      />
      <p class="text-sm font-medium text-slate-600">
        No hay trabajadores
      </p>
      <p class="text-xs text-slate-500">
        Agrega el primero para empezar.
      </p>
    </div>
    <div
      v-else
      class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="t in trabajadores"
        :key="t._id"
        class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <span class="text-sm font-bold text-primary">{{ t.nombre.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <p class="font-semibold text-slate-900 line-clamp-1">
                {{ t.nombre }}
              </p>
              <p class="text-xs text-slate-500">
                {{ t.cargo }}
              </p>
            </div>
          </div>
          <UDropdownMenu
            :items="getDropdownItems(t)"
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
            {{ formatCurrency(t.salario) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
