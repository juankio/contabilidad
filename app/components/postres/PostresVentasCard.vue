<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, ventas, crear, eliminar, loadingData } = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

const postreId = ref('')
const qty = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const error = ref('')
const submitting = ref(false)

const postreItems = computed(() => postres.value.map(p => ({ label: p.name, value: p._id })))

const submit = async () => {
  error.value = ''
  const value = Number(qty.value)
  if (!postreId.value || value <= 0) {
    error.value = 'Selecciona postre y cantidad válida.'
    return
  }

  submitting.value = true
  try {
    await crear('ventas', { postreId: postreId.value, qty: value, date: date.value })
    qty.value = ''
    toast.add({ title: 'Venta registrada', color: 'success' })
  } catch (err: unknown) {
    const errObj = err as Error
    error.value = errObj.message
    toast.add({ title: 'Error', description: errObj.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

const deleteVenta = async (id: string) => {
  if (!confirm('¿Eliminar venta?')) return
  try {
    await eliminar('ventas', id)
    toast.add({ title: 'Venta eliminada', color: 'success' })
  } catch (err: unknown) {
    const error = err as Error
    toast.add({ title: 'Error al eliminar', description: error.message, color: 'error' })
  }
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:shopping-bag"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Ventas
          </h2>
          <p class="text-sm text-slate-500">
            Registro diario de ventas.
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Postre vendido</label>
          <USelect
            v-model="postreId"
            :items="postreItems"
            placeholder="Seleccionar postre"
            size="lg"
            class="font-medium"
            icon="lucide:cake"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad</label>
          <UInput
            v-model="qty"
            placeholder="0"
            inputmode="numeric"
            size="lg"
            class="font-medium"
            icon="lucide:hash"
          />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha de venta</label>
        <UInput
          v-model="date"
          type="date"
          size="lg"
          class="font-medium"
          icon="lucide:calendar"
        />
      </div>
      <div class="pt-2">
        <UButton
          color="primary"
          icon="lucide:check-circle"
          block
          size="lg"
          class="font-semibold shadow-sm mt-1"
          :loading="submitting"
          @click="submit"
        >
          Registrar venta
        </UButton>
      </div>
      <p
        v-if="error"
        class="text-sm font-medium text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- List -->
    <div class="mt-6 flex-1 min-h-0">
      <ul
        v-if="loadingData"
        class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1"
      >
        <li
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3"
        >
          <div class="flex items-center gap-3">
            <USkeleton class="h-10 w-10 rounded-xl" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-24 rounded-md" />
              <USkeleton class="h-3 w-12 rounded-md" />
            </div>
          </div>
          <USkeleton class="h-8 w-16 rounded-xl" />
        </li>
      </ul>
      <div
        v-else-if="!ventas.length"
        class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <UIcon name="lucide:inbox" class="h-6 w-6" />
        </div>
        <p class="text-sm font-semibold text-slate-700">Sin ventas</p>
        <p class="mt-1 text-sm text-slate-500 max-w-[200px]">Registra tus primeras ventas.</p>
      </div>
      <ul
        v-else
        class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="venta in ventas"
          :key="venta._id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80">
              <UIcon
                name="lucide:shopping-bag"
                class="h-5 w-5 text-slate-500"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900">
                {{ postres.find(p => p._id === venta.postreId)?.name }}
              </p>
              <p class="text-xs font-semibold text-slate-500">
                {{ formatDate(venta.date) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight text-slate-700 ring-1 ring-inset ring-slate-200/60 shadow-sm">
              ×{{ venta.qty }}
            </span>
            <UButton
              color="error"
              variant="ghost"
              icon="lucide:trash-2"
              size="sm"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="deleteVenta(venta._id)"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
