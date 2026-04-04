<script setup lang="ts">
import MovementListModal from './movements/MovementListModal.vue'
import MovementEditModal from './movements/MovementEditModal.vue'
import MovementDeleteModal from './movements/MovementDeleteModal.vue'
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
  <div
    v-bind="$attrs"
    class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2 lg:col-span-2"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-slate-700">
        <UIcon
          name="lucide:list"
          class="h-4 w-4"
        />
        <p class="text-sm font-semibold">
          Últimos movimientos
        </p>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="!movimientos?.length"
        @click="showAllModal = true"
      >
        Ver todos
      </UButton>
    </div>

    <div class="mt-4 space-y-2">
      <div
        v-if="pending"
        class="space-y-2"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="skeleton h-14 w-full"
        />
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-500"
      >
        No se pudieron cargar los movimientos.
      </div>

      <div
        v-else-if="!movimientos?.length"
        class="grid min-h-32 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-6"
      >
        <div class="text-center">
          <UIcon
            name="lucide:inbox"
            class="mx-auto mb-2 h-8 w-8 text-slate-200"
          />
          <p class="text-sm font-medium text-slate-400">
            Sin movimientos aún
          </p>
          <p class="mt-0.5 text-xs text-slate-300">
            Registra un ingreso o gasto para empezar.
          </p>
        </div>
      </div>

      <TransitionGroup
        v-else
        name="mov"
        tag="div"
        class="space-y-2"
      >
        <MovementItem
          v-for="movimiento in previewMovimientos"
          :key="movimiento._id"
          :movimiento="movimiento"
        />
      </TransitionGroup>
    </div>
  </div>

  <MovementListModal
    :open="showAllModal"
    :movimientos="movimientos"
    @close="showAllModal = false"
    @edit="openEdit"
    @delete="openDelete"
  />

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
    @update:date="editDate = $event"
    @close="closeEdit"
    @confirm="submitEdit"
  />

  <MovementDeleteModal
    :open="deleteOpen"
    :type="deleteType"
    :label="deleteLabel"
    :loading="deleteLoading"
    :error="deleteError"
    @close="closeDelete"
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
