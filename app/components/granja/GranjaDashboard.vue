<script setup lang="ts">
import { computed, ref } from 'vue'
import LoteForm from './LoteForm.vue'
import ConcentradoForm from './ConcentradoForm.vue'
import LotesList from './LotesList.vue'
import LoteEditModal from './LoteEditModal.vue'
import LoteDeleteModal from './LoteDeleteModal.vue'

const props = defineProps<{
  lotes: import('../../composables/granja/useGranjaCerdos').Lote[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'crear', payload: import('../../composables/granja/useGranjaCerdos').LotePayload, onSuccess: () => void): void
  (e: 'comprar-concentrado', payload: import('../../composables/granja/useGranjaCerdos').ConcentradoPayload, onSuccess: () => void): void
  (e: 'editar', id: string, data: { nombreLoteMadre: string }, onSuccess: () => void): void
  (e: 'eliminar', id: string, onSuccess: () => void): void
}>()

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const editModalOpen = ref(false)
const loteEditando = ref<import('../../composables/granja/useGranjaCerdos').Lote | null>(null)

const openEditModal = (lote: import('../../composables/granja/useGranjaCerdos').Lote) => {
  loteEditando.value = lote
  editModalOpen.value = true
}

const deleteModalOpen = ref(false)
const loteToDelete = ref<import('../../composables/granja/useGranjaCerdos').Lote | null>(null)

const openDeleteModal = (lote: import('../../composables/granja/useGranjaCerdos').Lote) => {
  loteToDelete.value = lote
  deleteModalOpen.value = true
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
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
        <LoteForm @submit="(payload) => emit('crear', payload, () => {})" />
        <ConcentradoForm @submit="(payload) => emit('comprar-concentrado', payload, () => {})" />
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
      @submit="(id, data) => emit('editar', id, data, () => editModalOpen = false)"
    />

    <LoteDeleteModal
      v-model:open="deleteModalOpen"
      :lote="loteToDelete"
      @confirm="(id) => emit('eliminar', id, () => deleteModalOpen = false)"
    />
  </main>
</template>