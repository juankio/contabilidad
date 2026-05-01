<script setup lang="ts">
import TrabajadorForm from './TrabajadorForm.vue'
import PagoForm from './PagoForm.vue'
import TrabajadoresList from './TrabajadoresList.vue'
import TrabajadorEditModal from './TrabajadorEditModal.vue'
import TrabajadorDeleteModal from './TrabajadorDeleteModal.vue'
import type { Trabajador, TrabajadorPayload, PagoPayload } from '../../composables/trabajadores/useTrabajadores'

defineProps<{
  profileInitial: string
  saldoDisponible: number
  formatCurrency: (val: number) => string
  trabajadores: Trabajador[]
  loading: boolean
  isEditModalOpen: boolean
  selectedTrabajador: Trabajador | null
  isDeleteModalOpen: boolean
  trabajadorToDelete: Trabajador | null
}>()

const emit = defineEmits<{
  (e: 'update:isEditModalOpen', val: boolean): void
  (e: 'update:isDeleteModalOpen', val: boolean): void
  (e: 'submitCrear', payload: TrabajadorPayload): void
  (e: 'submitPagar', payload: PagoPayload): void
  (e: 'openEdit', trabajador: Trabajador): void
  (e: 'submitEditar', id: string, payload: Partial<TrabajadorPayload>): void
  (e: 'openDelete', trabajador: Trabajador): void
  (e: 'submitEliminar', id: string): void
}>()
</script>

<template>
  <main class="min-h-screen bg-transparent text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
      <header class="rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="relative shrink-0">
              <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
                <UIcon
                  name="lucide:users"
                  class="h-6 w-6 sm:h-7 sm:w-7 text-white"
                />
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Módulo
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Trabajadores y Nómina
              </h1>
            </div>
          </div>

          <div class="flex items-center justify-between w-full md:w-auto gap-3 rounded-2xl bg-emerald-50 px-4 py-2 sm:py-3 border border-emerald-100 mt-4 md:mt-0">
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UIcon
                  name="lucide:wallet"
                  class="h-4 w-4"
                />
              </div>
              <div>
                <p class="text-xs text-emerald-600 font-medium">
                  Disponible para pagos
                </p>
                <p class="text-lg font-bold text-emerald-700">
                  {{ formatCurrency(saldoDisponible) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TrabajadorForm @submit="emit('submitCrear', $event)" />
        <PagoForm
          :trabajadores="trabajadores"
          @submit="emit('submitPagar', $event)"
        />
      </div>

      <TrabajadoresList
        :trabajadores="trabajadores"
        :loading="loading"
        :format-currency="formatCurrency"
        @edit="emit('openEdit', $event)"
        @delete="emit('openDelete', $event)"
      />
    </section>

    <!-- Modal Editar -->
    <TrabajadorEditModal
      :open="isEditModalOpen"
      @update:open="emit('update:isEditModalOpen', $event)"
      :trabajador="selectedTrabajador"
      @submit="(id, payload) => emit('submitEditar', id, payload)"
    />

    <!-- Modal Eliminar -->
    <TrabajadorDeleteModal
      :open="isDeleteModalOpen"
      @update:open="emit('update:isDeleteModalOpen', $event)"
      :trabajador="trabajadorToDelete"
      @confirm="emit('submitEliminar', $event)"
    />
  </main>
</template>
