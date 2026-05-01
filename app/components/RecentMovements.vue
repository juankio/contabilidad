<script setup lang="ts">
import MovementModals from './movements/MovementModals.vue'
import RecentMovementsList from './movements/RecentMovementsList.vue'
import { useRecentMovements } from '../composables/movimientos/useRecentMovements'

defineOptions({ inheritAttrs: false })

const {
  movimientos, pending, error, showAllModal, previewMovimientos,
  editOpen, editType, editDescription, editCategory, editAmountInput, editDate,
  editLoading, editError, canSubmitEdit,
  deleteOpen, deleteType, deleteLabel, deleteLoading, deleteError,
  openEdit, closeEdit, submitEdit, openDelete, closeDelete, confirmDelete
} = useRecentMovements()
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col h-full min-h-[400px] min-w-0">
    <div class="mb-6 flex items-start justify-between min-w-0">
      <div class="flex items-center gap-4 min-w-0">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:clock"
            class="h-5 w-5"
          />
        </div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold tracking-tight text-slate-900 truncate">
            Movimientos recientes
          </h2>
          <p class="text-sm text-slate-500 truncate">
            Últimas transacciones
          </p>
        </div>
      </div>
    </div>

    <!-- Componente de Lista -->
    <RecentMovementsList
      :pending="pending"
      :error="error"
      :preview-movimientos="previewMovimientos"
      @edit="openEdit"
      @delete="openDelete"
    />

    <div class="mt-6 pt-4 border-t border-slate-100/80">
      <UButton
        color="neutral"
        variant="ghost"
        block
        class="text-slate-500 hover:text-slate-900 transition-colors font-medium rounded-xl"
        icon="lucide:arrow-right"
        trailing
        @click="showAllModal = true"
      >
        Ver todos
      </UButton>
    </div>
  </div>

  <!-- Componente de Modales (Orquestador) -->
  <MovementModals
    :show-all-modal="showAllModal"
    :movimientos="movimientos"
    
    :edit-open="editOpen"
    :edit-type="editType"
    :edit-description="editDescription"
    :edit-category="editCategory"
    :edit-amount-input="editAmountInput"
    :edit-date="editDate"
    :edit-loading="editLoading"
    :edit-error="editError"
    :can-submit-edit="canSubmitEdit"
    
    :delete-open="deleteOpen"
    :delete-type="deleteType"
    :delete-label="deleteLabel"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"

    @update:show-all-modal="showAllModal = $event"
    @update:edit-description="editDescription = $event"
    @update:edit-category="editCategory = $event"
    @update:edit-amount-input="editAmountInput = $event"
    @update:edit-date="editDate = $event"
    
    @edit="openEdit"
    @close-edit="closeEdit"
    @submit-edit="submitEdit"
    
    @delete="openDelete"
    @close-delete="closeDelete"
    @confirm-delete="confirmDelete"
  />
</template>
