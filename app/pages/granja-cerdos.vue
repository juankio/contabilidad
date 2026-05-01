<script setup lang="ts">
import { onMounted } from 'vue'
import { useGranjaCerdos } from '../composables/granja/useGranjaCerdos'
import GranjaDashboard from '../components/granja/GranjaDashboard.vue'

definePageMeta({ requiresModule: 'granja-cerdos' })

const { lotes, loading, fetchLotes, crearLote, comprarConcentrado, editarLote, eliminarLote } = useGranjaCerdos()
const toast = useToast()

const handleCrearLote = async (payload: import('../composables/granja/useGranjaCerdos').LotePayload, onSuccess: () => void) => {
  try {
    await crearLote(payload)
    onSuccess()
    toast.add({ title: 'Lote registrado', description: 'El nuevo lote ha sido añadido a la granja.', icon: 'lucide:check-circle', color: 'success' })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({ title: 'Error al registrar lote', description: error.message || 'No se pudo crear el lote.', icon: 'lucide:alert-circle', color: 'error' })
  }
}

const handleComprarConcentrado = async (payload: import('../composables/granja/useGranjaCerdos').ConcentradoPayload, onSuccess: () => void) => {
  try {
    await comprarConcentrado(payload)
    onSuccess()
    toast.add({ title: 'Compra exitosa', description: 'El concentrado se ha registrado y se ha descontado de los fondos globales.', icon: 'lucide:check-circle', color: 'success' })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({ title: 'Fondos insuficientes o error', description: error.message || 'No se pudo comprar el concentrado.', icon: 'lucide:alert-triangle', color: 'error' })
  }
}

const handleEditarLote = async (id: string, data: { nombreLoteMadre: string }, onSuccess: () => void) => {
  try {
    await editarLote(id, data)
    onSuccess()
    toast.add({ title: 'Lote actualizado', description: 'El lote ha sido editado correctamente.', icon: 'lucide:check-circle', color: 'success' })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({ title: 'Error al editar lote', description: error.message || 'No se pudo editar el lote.', icon: 'lucide:alert-circle', color: 'error' })
  }
}

const handleEliminarLote = async (id: string, onSuccess: () => void) => {
  try {
    await eliminarLote(id)
    onSuccess()
    toast.add({ title: 'Lote eliminado', description: 'El lote ha sido eliminado de la granja.', icon: 'lucide:check-circle', color: 'success' })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({ title: 'Error al eliminar lote', description: error.message || 'No se pudo eliminar el lote.', icon: 'lucide:alert-circle', color: 'error' })
  }
}

onMounted(() => fetchLotes())
</script>

<template>
  <GranjaDashboard
    :lotes="lotes"
    :loading="loading"
    @crear="handleCrearLote"
    @comprar-concentrado="handleComprarConcentrado"
    @editar="handleEditarLote"
    @eliminar="handleEliminarLote"
  />
</template>