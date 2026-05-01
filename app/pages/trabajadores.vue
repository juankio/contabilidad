<script setup lang="ts">
import { useTrabajadores } from '../composables/trabajadores/useTrabajadores'
import { useResumen } from '../composables/useResumen'
import TrabajadoresDashboard from '../components/trabajadores/TrabajadoresDashboard.vue'

definePageMeta({ requiresModule: 'trabajadores' })

useSeoMeta({
  title: 'Trabajadores y Nómina | Mi App',
  description: 'Gestión de trabajadores y control de pagos.'
})

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador, editarTrabajador, eliminarTrabajador } = useTrabajadores()
const { resumen, formatCurrency } = useResumen()

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
  <TrabajadoresDashboard
    :profile-initial="profileInitial"
    :saldo-disponible="saldoDisponible"
    :format-currency="formatCurrency"
    :trabajadores="trabajadores"
    :loading="loading"
    :is-edit-modal-open="isEditModalOpen"
    @update:is-edit-modal-open="isEditModalOpen = $event"
    :selected-trabajador="selectedTrabajador"
    :is-delete-modal-open="isDeleteModalOpen"
    @update:is-delete-modal-open="isDeleteModalOpen = $event"
    :trabajador-to-delete="trabajadorToDelete"
    @submit-crear="handleCrear"
    @submit-pagar="handlePagar"
    @open-edit="openEdit"
    @submit-editar="handleEditar"
    @open-delete="openDelete"
    @submit-eliminar="handleEliminar"
  />
</template>
