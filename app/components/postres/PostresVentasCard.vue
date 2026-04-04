<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, ventas, addVenta } = usePostres()
const postreId = ref('')
const qty = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const error = ref('')

const postreItems = computed(() => postres.value.map(p => ({ label: p.name, value: p.id })))
const submit = () => {
  error.value = ''
  const value = Number(qty.value)
  if (!addVenta(postreId.value, value, date.value)) {
    error.value = 'Selecciona postre y cantidad.'
    return
  }
  qty.value = ''
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <section class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center gap-2 text-slate-700">
        <UIcon
          name="lucide:shopping-bag"
          class="h-4 w-4"
        />
        <p class="text-sm font-semibold">
          Ventas
        </p>
      </div>
      <p class="mt-1 text-xs text-slate-400">
        Registro diario de ventas
      </p>
    </div>

    <!-- Form -->
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <USelect
          v-model="postreId"
          :items="postreItems"
          placeholder="Postre"
          size="sm"
        />
        <UInput
          v-model="qty"
          placeholder="Cantidad"
          size="sm"
          inputmode="numeric"
        />
      </div>
      <UInput
        v-model="date"
        type="date"
        size="sm"
      />
      <UButton
        color="primary"
        icon="i-lucide-plus"
        size="sm"
        block
        @click="submit"
      >
        Agregar venta
      </UButton>
      <p
        v-if="error"
        class="text-xs text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- List -->
    <div class="mt-4">
      <div
        v-if="!ventas.length"
        class="rounded-2xl border border-dashed border-slate-200 py-6 text-center"
      >
        <p class="text-xs text-slate-400">
          Sin ventas registradas
        </p>
      </div>
      <ul
        v-else
        class="space-y-1.5"
      >
        <li
          v-for="venta in ventas"
          :key="venta.id"
          class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
        >
          <div>
            <p class="text-sm font-medium text-slate-800">
              {{ postres.find(p => p.id === venta.postreId)?.name }}
            </p>
            <p class="text-xs text-slate-400">
              {{ formatDate(venta.date) }}
            </p>
          </div>
          <span class="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            × {{ venta.qty }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
