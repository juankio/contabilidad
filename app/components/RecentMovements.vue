<script setup lang="ts">
import MovementListModal from './movements/MovementListModal.vue'
import MovementEditModal from './movements/MovementEditModal.vue'
import MovementDeleteModal from './movements/MovementDeleteModal.vue'
import MovementItem from './movements/MovementItem.vue'
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
  <div class="rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md flex flex-col h-full min-h-[400px] min-w-0">
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

    <!-- Lista -->
    <div class="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 min-w-0">
      <template v-if="pending">
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-center justify-between rounded-2xl p-3 border border-slate-100 bg-slate-50/50"
        >
          <div class="flex items-center gap-3">
            <USkeleton class="h-10 w-10 rounded-xl" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-24 rounded-md" />
              <USkeleton class="h-3 w-16 rounded-md" />
            </div>
          </div>
          <USkeleton class="h-5 w-16 rounded-md" />
        </div>
      </template>

      <template v-else-if="error || !movimientos">
        <div class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400 mb-3">
            <UIcon
              name="lucide:alert-triangle"
              class="h-6 w-6"
            />
          </div>
          <p class="text-sm font-semibold text-rose-600">
            Error
          </p>
          <p class="mt-1 text-sm text-rose-500 max-w-[200px]">
            No pudimos cargar los movimientos.
          </p>
        </div>
      </template>

      <template v-else-if="previewMovimientos.length === 0">
        <div class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <UIcon
              name="lucide:inbox"
              class="h-6 w-6"
            />
          </div>
          <p class="text-sm font-semibold text-slate-700">
            Sin movimientos
          </p>
          <p class="mt-1 text-sm text-slate-500 max-w-[200px]">
            Aún no hay transacciones en este perfil.
          </p>
        </div>
      </template>

      <template v-else>
        <TransitionGroup
          name="mov"
          tag="div"
          class="space-y-2 relative"
        >
          <MovementItem
            v-for="mov in previewMovimientos"
            :key="mov._id"
            :movimiento="mov"
            @edit="openEdit"
            @delete="openDelete"
          />
        </TransitionGroup>
      </template>
    </div>

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

    <!-- Modals -->
    <MovementListModal
      v-model:open="showAllModal"
      :movimientos="movimientos || []"
      @edit="openEdit"
      @delete="openDelete"
    />
  </div>

  <MovementEditModal
    :open="editOpen"
    :type="editType"
    :description="editDescription"
    :category="editCategory"
    :amount-input="editAmountInput"
    :date="editDate"
    :loading="editLoading"
    :error="editError"
    :can-submit="canSubmitEdit"
    @update:description="editDescription = $event"
    @update:category="editCategory = $event"
    @update:amount-input="editAmountInput = $event"
    @update:date="editDate = String($event)"
    @update:open="closeEdit"
    @confirm="submitEdit"
  />

  <MovementDeleteModal
    :open="deleteOpen"
    :type="deleteType"
    :label="deleteLabel"
    :loading="deleteLoading"
    :error="deleteError"
    @update:open="closeDelete"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.mov-enter-active { transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.mov-leave-active { transition: all 0.18s ease; }
.mov-enter-from   { opacity: 0; transform: translateY(-8px); }
.mov-leave-to     { opacity: 0; transform: translateX(16px); }
.mov-move         { transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
</style>
