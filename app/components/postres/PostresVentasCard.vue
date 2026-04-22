<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, ventas, crear, eliminar, loadingData } = usePostres()
const toast = useToast()

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
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow h-full">
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
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
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <USelect
          v-model="postreId"
          :items="postreItems"
          placeholder="Seleccionar postre"
          icon="lucide:cake"
        />
        <UInput
          v-model="qty"
          placeholder="Cantidad"
          inputmode="numeric"
          icon="lucide:hash"
        />
      </div>
      <UInput
        v-model="date"
        type="date"
        icon="lucide:calendar"
      />
      <UButton
        color="success"
        icon="lucide:check-circle"
        block
        :loading="submitting"
        @click="submit"
      >
        Registrar venta
      </UButton>
      <p
        v-if="error"
        class="text-sm font-medium text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- List -->
    <div class="mt-3 flex-1 min-h-0">
      <ul
        v-if="loadingData"
        class="space-y-2 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1"
      >
        <li
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-2"
        >
          <div class="flex items-center gap-2">
            <USkeleton class="h-8 w-8 rounded-lg" />
            <div class="space-y-1.5">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-3 w-12" />
            </div>
          </div>
          <USkeleton class="h-7 w-12 rounded-xl" />
        </li>
      </ul>
      <div
        v-else-if="!ventas.length"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-6 text-center"
      >
        <UIcon
          name="lucide:inbox"
          class="mb-2 h-8 w-8 text-slate-300"
        />
        <p class="text-sm font-medium text-slate-600">
          Sin ventas
        </p>
        <p class="text-xs text-slate-500">
          Registra tus primeras ventas.
        </p>
      </div>
      <ul
        v-else
        class="space-y-2 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="venta in ventas"
          :key="venta._id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-2 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
              <UIcon
                name="lucide:shopping-bag"
                class="h-4 w-4 text-emerald-600"
              />
            </div>
            <div>
              <p class="text-base font-semibold text-slate-900">
                {{ postres.find(p => p._id === venta.postreId)?.name }}
              </p>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {{ formatDate(venta.date) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-xl bg-emerald-50 px-3 py-1 text-sm font-bold tracking-tight text-emerald-700 ring-1 ring-emerald-500/20">
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
