<script setup lang="ts">
import MovementListModal from './MovementListModal.vue'
import MovementEditModal from './MovementEditModal.vue'
import MovementDeleteModal from './MovementDeleteModal.vue'
import type { MovimientoRow } from '../../composables/movimientos/useMovementCrud'

defineProps<{
  showAllModal: boolean
  movimientos: MovimientoRow[] | null
  
  editOpen: boolean
  editType: string
  editDescription: string
  editCategory: string
  editAmountInput: string
  editDate: string
  editLoading: boolean
  editError: string | null
  canSubmitEdit: boolean
  
  deleteOpen: boolean
  deleteType: string
  deleteLabel: string
  deleteLoading: boolean
  deleteError: string | null
}>()

const emit = defineEmits<{
  (e: 'update:showAllModal', value: boolean): void
  (e: 'update:editDescription', value: string): void
  (e: 'update:editCategory', value: string): void
  (e: 'update:editAmountInput', value: string): void
  (e: 'update:editDate', value: string): void
  
  (e: 'edit', mov: MovimientoRow): void
  (e: 'closeEdit'): void
  (e: 'submitEdit'): void
  
  (e: 'delete', mov: MovimientoRow): void
  (e: 'closeDelete'): void
  (e: 'confirmDelete'): void
}>()
</script>

<template>
  <MovementListModal
    :open="showAllModal"
    @update:open="emit('update:showAllModal', $event)"
    :movimientos="movimientos || []"
    @edit="emit('edit', $event)"
    @delete="emit('delete', $event)"
  />

  <MovementEditModal
    :open="editOpen"
    :type="editType"
    :description="editDescription"
    :category="editCategory"
    :amount-input="editAmountInput"
    :date="editDate"
    :loading="editLoading"
    :error="editError || ''"
    :can-submit="canSubmitEdit"
    @update:description="emit('update:editDescription', $event)"
    @update:category="emit('update:editCategory', $event)"
    @update:amount-input="emit('update:editAmountInput', $event)"
    @update:date="emit('update:editDate', String($event))"
    @update:open="emit('closeEdit')"
    @confirm="emit('submitEdit')"
  />

  <MovementDeleteModal
    :open="deleteOpen"
    :type="deleteType"
    :label="deleteLabel"
    :loading="deleteLoading"
    :error="deleteError || ''"
    @update:open="emit('closeDelete')"
    @confirm="emit('confirmDelete')"
  />
</template>
