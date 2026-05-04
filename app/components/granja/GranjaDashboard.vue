<script setup lang="ts">

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
  <main class="min-h-screen bg-transparent text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="relative shrink-0">
              <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
                <UIcon
                  name="lucide:paw-print"
                  class="h-6 w-6 sm:h-7 sm:w-7 text-white"
                />
              </div>
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
          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:arrow-left"
              class="rounded-xl px-5 font-medium transition-colors hover:bg-slate-100 w-full md:w-auto justify-center"
              to="/"
            >
              Volver
            </UButton>
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