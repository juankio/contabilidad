<script setup lang="ts">
import { useGranjaCerdos } from '../composables/granja/useGranjaCerdos'
import LoteForm from '../components/granja/LoteForm.vue'
import ConcentradoForm from '../components/granja/ConcentradoForm.vue'
import LotesList from '../components/granja/LotesList.vue'
import LoteEditModal from '../components/granja/LoteEditModal.vue'
import LoteDeleteModal from '../components/granja/LoteDeleteModal.vue'
import { computed, ref, onMounted } from 'vue'

definePageMeta({ requiresModule: 'granja-cerdos' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { lotes, loading, fetchLotes, crearLote, comprarConcentrado, editarLote, eliminarLote } = useGranjaCerdos()

const toast = useToast()

const editModalOpen = ref(false)
const loteEditando = ref<import('../composables/granja/useGranjaCerdos').Lote | null>(null)

const openEditModal = (lote: import('../composables/granja/useGranjaCerdos').Lote) => {
  loteEditando.value = lote
  editModalOpen.value = true
}

const handleEditarLote = async (id: string, data: { nombreLoteMadre: string }) => {
  try {
    await editarLote(id, data)
    editModalOpen.value = false
    toast.add({
      title: 'Lote actualizado',
      description: 'El lote ha sido editado correctamente.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Error al editar lote',
      description: error.message || 'No se pudo editar el lote.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

// Delete State
const deleteModalOpen = ref(false)
const loteToDelete = ref<import('../composables/granja/useGranjaCerdos').Lote | null>(null)

const openDeleteModal = (lote: import('../composables/granja/useGranjaCerdos').Lote) => {
  loteToDelete.value = lote
  deleteModalOpen.value = true
}

const handleConfirmEliminarLote = async (id: string) => {
  try {
    await eliminarLote(id)
    deleteModalOpen.value = false
    toast.add({
      title: 'Lote eliminado',
      description: 'El lote ha sido eliminado de la granja.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Error al eliminar lote',
      description: error.message || 'No se pudo eliminar el lote.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

const handleCrearLote = async (payload: import('../composables/granja/useGranjaCerdos').LotePayload) => {
  try {
    await crearLote(payload)
    toast.add({
      title: 'Lote registrado',
      description: 'El nuevo lote ha sido añadido a la granja.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Error al registrar lote',
      description: error.message || 'No se pudo crear el lote.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

const handleComprarConcentrado = async (payload: import('../composables/granja/useGranjaCerdos').ConcentradoPayload) => {
  try {
    await comprarConcentrado(payload)
    toast.add({
      title: 'Compra exitosa',
      description: 'El concentrado se ha registrado y se ha descontado de los fondos globales.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({
      title: 'Fondos insuficientes o error',
      description: error.message || 'No se pudo comprar el concentrado.',
      icon: 'lucide:alert-triangle',
      color: 'error'
    })
  }
}

onMounted(() => fetchLotes())
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div
            class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
            style="background: var(--brand-600)"
          >
            <span class="text-sm font-bold text-white">{{ profileInitial }}</span>
            <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
              <UIcon
                name="lucide:paw-print"
                class="h-3 w-3 text-white"
              />
            </span>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Módulo
            </p>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
              Granja de Cerdos
            </h1>
            <p class="text-xs text-slate-500">
              Controla animales, alimentación, peso y gastos.
            </p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LoteForm @submit="handleCrearLote" />
        <ConcentradoForm @submit="handleComprarConcentrado" />
      </div>

      <LotesList
        :lotes="lotes"
        :loading="loading"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </section>

    <LoteEditModal
      v-model:open="editModalOpen"
      :lote="loteEditando"
      @submit="handleEditarLote"
    />

    <LoteDeleteModal
      v-model:open="deleteModalOpen"
      :lote="loteToDelete"
      @confirm="handleConfirmEliminarLote"
    />
  </main>
</template>
