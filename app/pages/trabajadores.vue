<script setup lang="ts">
import { useTrabajadores } from '../composables/trabajadores/useTrabajadores'
import TrabajadorForm from '../components/trabajadores/TrabajadorForm.vue'
import PagoForm from '../components/trabajadores/PagoForm.vue'
import TrabajadoresList from '../components/trabajadores/TrabajadoresList.vue'
import TrabajadorEditModal from '../components/trabajadores/TrabajadorEditModal.vue'
import TrabajadorDeleteModal from '../components/trabajadores/TrabajadorDeleteModal.vue'
import { useResumen } from '../composables/useResumen'
import { computed, ref, onMounted } from 'vue'

definePageMeta({ requiresModule: 'trabajadores' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador, editarTrabajador, eliminarTrabajador } = useTrabajadores()
const { resumen, formatCurrency } = await useResumen()

const saldoDisponible = computed(() => resumen.value?.saldoDisponible ?? resumen.value?.saldo ?? 0)

const toast = useToast()

const handleCrear = async (payload: import('../composables/trabajadores/useTrabajadores').TrabajadorPayload) => {
  try {
    await crearTrabajador(payload)
    toast.add({
      title: 'Trabajador creado',
      description: 'El trabajador ha sido añadido exitosamente a la plantilla.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Error al crear',
      description: error.message || 'No se pudo crear el trabajador.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

const handlePagar = async (payload: import('../composables/trabajadores/useTrabajadores').PagoPayload) => {
  try {
    await pagarTrabajador(payload)
    toast.add({
      title: 'Pago exitoso',
      description: 'El pago ha sido registrado y descontado de tus fondos.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'No se pudo procesar',
      description: error.message || 'Error al pagar.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

// Edit state
const isEditModalOpen = ref(false)
const selectedTrabajador = ref<import('../composables/trabajadores/useTrabajadores').Trabajador | null>(null)

const openEdit = (trabajador: import('../composables/trabajadores/useTrabajadores').Trabajador) => {
  selectedTrabajador.value = trabajador
  isEditModalOpen.value = true
}

const handleEditar = async (id: string, payload: Partial<import('../composables/trabajadores/useTrabajadores').TrabajadorPayload>) => {
  try {
    await editarTrabajador(id, payload)
    isEditModalOpen.value = false
    toast.add({
      title: 'Trabajador actualizado',
      description: 'Los datos han sido guardados correctamente.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Error al actualizar',
      description: error.message || 'No se pudo editar el trabajador.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

// Delete state
const isDeleteModalOpen = ref(false)
const trabajadorToDelete = ref<import('../composables/trabajadores/useTrabajadores').Trabajador | null>(null)

const openDelete = (trabajador: import('../composables/trabajadores/useTrabajadores').Trabajador) => {
  trabajadorToDelete.value = trabajador
  isDeleteModalOpen.value = true
}

const handleEliminar = async (id: string) => {
  try {
    await eliminarTrabajador(id)
    isDeleteModalOpen.value = false
    toast.add({
      title: 'Trabajador eliminado',
      description: 'El trabajador ha sido dado de baja exitosamente.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Error al eliminar',
      description: error.message || 'No se pudo eliminar el trabajador.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

onMounted(() => fetchTrabajadores())
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style="background: var(--brand-600)"
            >
              <span class="text-sm font-bold text-white">{{ profileInitial }}</span>
              <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
                <UIcon
                  name="lucide:users"
                  class="h-3 w-3 text-white"
                />
              </span>
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

          <div class="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-100">
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
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TrabajadorForm @submit="handleCrear" />
        <PagoForm
          :trabajadores="trabajadores"
          @submit="handlePagar"
        />
      </div>

      <TrabajadoresList
        :trabajadores="trabajadores"
        :loading="loading"
        :format-currency="formatCurrency"
        @edit="openEdit"
        @delete="openDelete"
      />
    </section>

    <!-- Modal Editar -->
    <TrabajadorEditModal
      v-model:open="isEditModalOpen"
      :trabajador="selectedTrabajador"
      @submit="handleEditar"
    />

    <!-- Modal Eliminar -->
    <TrabajadorDeleteModal
      v-model:open="isDeleteModalOpen"
      :trabajador="trabajadorToDelete"
      @confirm="handleEliminar"
    />
  </main>
</template>
