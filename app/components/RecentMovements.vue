<script setup lang="ts">
import MovementDeleteModal from './movements/MovementDeleteModal.vue'
import MovementEditModal from './movements/MovementEditModal.vue'
import { useMovementCrud, type MovimientoRow } from '../composables/movimientos/useMovementCrud'

defineOptions({ inheritAttrs: false })

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
  <div
    v-bind="$attrs"
    class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2"
  >
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">
          Últimos movimientos
        </h2>
        <p class="mt-0.5 text-xs text-slate-400">
          Actividad reciente del perfil
        </p>
      </div>
      <button
        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!movimientos?.length"
        @click="showAllModal = true"
      >
        Ver todos
      </button>
    </div>

    <div class="mt-4 space-y-2">
      <!-- Skeleton -->
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

      <!-- Empty state -->
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
        <div
          v-for="movimiento in previewMovimientos"
          :key="movimiento._id"
          class="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-sm"
        >
          <!-- Dot indicator -->
          <div
            class="h-2 w-2 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125"
            :class="movimiento.type === 'Ingreso' ? 'bg-emerald-400' : 'bg-amber-400'"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-slate-800 transition-colors duration-150 group-hover:text-slate-900">
              {{ movimiento.description }}
            </p>
            <p class="mt-0.5 text-xs text-slate-400">
              {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
            </p>
          </div>
          <p
            class="shrink-0 text-sm font-semibold tabular-nums"
            :class="movimiento.type === 'Ingreso' ? 'text-emerald-600' : 'text-amber-600'"
          >
            {{ movimiento.type === 'Ingreso' ? '+' : '-' }}{{ formatCurrency(movimiento.amount) }}
          </p>
        </div>
      </TransitionGroup>
    </div>
  </div>

  <Transition name="modal">
    <div
      v-if="showAllModal"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
      @click.self="showAllModal = false"
    >
      <div class="anim-scale w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">
              Todos los movimientos
            </h3>
            <p class="mt-0.5 text-xs text-slate-400">
              {{ movimientos?.length ?? 0 }} registros
            </p>
          </div>
          <button
            class="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-slate-700 active:scale-95"
            @click="showAllModal = false"
          >
            Cerrar
          </button>
        </div>

        <div class="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
          <div
            v-for="movimiento in movimientos || []"
            :key="`modal-${movimiento._id}`"
            class="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50"
          >
            <div
              class="h-2 w-2 shrink-0 rounded-full"
              :class="movimiento.type === 'Ingreso' ? 'bg-emerald-400' : 'bg-amber-400'"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-800">
                {{ movimiento.description }}
              </p>
              <p class="mt-0.5 text-xs text-slate-400">
                {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p
                class="shrink-0 text-sm font-semibold tabular-nums"
                :class="movimiento.type === 'Ingreso' ? 'text-emerald-600' : 'text-amber-600'"
              >
                {{ movimiento.type === 'Ingreso' ? '+' : '-' }}{{ formatCurrency(movimiento.amount) }}
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
  </Transition>

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
/* Lista de movimientos */
.mov-enter-active { transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.mov-leave-active { transition: all 0.18s ease; }
.mov-enter-from   { opacity: 0; transform: translateY(-8px); }
.mov-leave-to     { opacity: 0; transform: translateX(16px); }
.mov-move         { transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1); }

/* Modal backdrop + panel */
.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }
</style>
