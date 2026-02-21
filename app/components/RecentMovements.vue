<script setup lang="ts">
import MovementDeleteModal from './movements/MovementDeleteModal.vue'
import MovementEditModal from './movements/MovementEditModal.vue'
import { useMovementCrud, type MovimientoRow } from '../composables/movimientos/useMovementCrud'

const { data: movimientos, pending, error, refresh: refreshMovimientos } = await useFetch<MovimientoRow[]>('/api/movimientos', {
  key: 'movimientos',
  query: { limit: 50 }
})

const { formatCurrency, formatShortDate } = useFormatters()
const showAllModal = ref(false)
const previewMovimientos = computed(() => (movimientos.value ?? []).slice(0, 3))

const {
  editOpen,
  editType,
  editDescription,
  editCategory,
  editAmountInput,
  editDate,
  editLoading,
  editError,
  canSubmitEdit,
  deleteOpen,
  deleteType,
  deleteLabel,
  deleteLoading,
  deleteError,
  openEdit,
  closeEdit,
  submitEdit,
  openDelete,
  closeDelete,
  confirmDelete
} = useMovementCrud(async () => {
  await refreshMovimientos()
})
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        Ultimos movimientos
      </h2>
      <button
        class="text-xs font-semibold text-emerald-600 disabled:cursor-not-allowed disabled:text-slate-400"
        :disabled="!movimientos?.length"
        @click="showAllModal = true"
      >
        Ver todos
      </button>
    </div>

    <div class="mt-4 grid gap-3">
      <div
        v-if="pending"
        class="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-500"
      >
        Cargando movimientos...
      </div>
      <div
        v-else-if="error"
        class="rounded-2xl border border-rose-100 px-4 py-3 text-sm text-rose-500"
      >
        No se pudieron cargar los movimientos.
      </div>
      <div
        v-else-if="!movimientos?.length"
        class="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-500"
      >
        Aun no hay movimientos registrados.
      </div>
      <template v-else>
        <div
          v-for="movimiento in previewMovimientos"
          :key="movimiento._id"
          class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">
              {{ movimiento.description }}
            </p>
            <p class="text-xs text-slate-400">
              {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
            </p>
          </div>
          <p
            class="text-sm font-semibold"
            :class="movimiento.type === 'Ingreso' ? 'text-emerald-600' : 'text-amber-600'"
          >
            {{ movimiento.type === 'Ingreso' ? '+' : '-' }}
            {{ formatCurrency(movimiento.amount) }}
          </p>
        </div>
      </template>
    </div>
  </div>

  <div
    v-if="showAllModal"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="showAllModal = false"
  >
    <div class="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">
          Todos los movimientos
        </h3>
        <button
          class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
          @click="showAllModal = false"
        >
          Cerrar
        </button>
      </div>

      <div class="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
        <div
          v-for="movimiento in movimientos || []"
          :key="`modal-${movimiento._id}`"
          class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">
              {{ movimiento.description }}
            </p>
            <p class="text-xs text-slate-400">
              {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <p
              class="text-sm font-semibold"
              :class="movimiento.type === 'Ingreso' ? 'text-emerald-600' : 'text-amber-600'"
            >
              {{ movimiento.type === 'Ingreso' ? '+' : '-' }}
              {{ formatCurrency(movimiento.amount) }}
            </p>
            <div class="flex items-center gap-1">
              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                @click="openEdit(movimiento)"
              >
                <UIcon
                  name="lucide:pencil"
                  class="h-3.5 w-3.5"
                />
                Editar
              </UButton>
              <UButton
                color="error"
                variant="soft"
                size="xs"
                @click="openDelete(movimiento)"
              >
                <UIcon
                  name="lucide:trash-2"
                  class="h-3.5 w-3.5"
                />
                Eliminar
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
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
