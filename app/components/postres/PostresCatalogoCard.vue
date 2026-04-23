<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, crear, eliminar, loadingData } = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

const name = ref('')
const price = ref('')
const error = ref('')
const submitting = ref(false)

const submit = async () => {
  error.value = ''
  const cleanName = name.value.trim()
  const value = Number(price.value)

  if (!cleanName || value <= 0) {
    error.value = 'Completa nombre y precio válido.'
    return
  }

  submitting.value = true
  try {
    await crear('postres', { name: cleanName, price: value })
    name.value = ''
    price.value = ''
    toast.add({ title: 'Postre agregado', color: 'success' })
  } catch (err: unknown) {
    const errorMsg = err as Error
    error.value = errorMsg.message
    toast.add({ title: 'Error', description: errorMsg.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

const deletePostre = async (id: string) => {
  if (!confirm('¿Eliminar postre?')) return
  try {
    await eliminar('postres', id)
    toast.add({ title: 'Postre eliminado', color: 'success' })
  } catch (err: unknown) {
    const errorMsg = err as Error
    toast.add({ title: 'Error al eliminar', description: errorMsg.message, color: 'error' })
  }
}
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:cake"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Postres
          </h2>
          <p class="text-sm text-slate-500">
            Catálogo y precio de venta.
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre</label>
          <UInput
            v-model="name"
            placeholder="Ej: Torta 3 leches"
            size="lg"
            class="font-medium"
            icon="lucide:tag"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Precio Venta</label>
          <UInput
            v-model="price"
            placeholder="0"
            inputmode="numeric"
            size="lg"
            class="font-medium"
            :ui="{ icon: { leading: { pointer: '' } } }"
          >
            <template #leading>
              <span class="text-slate-500">$</span>
            </template>
          </UInput>
        </div>
      </div>
      <div class="pt-2">
        <UButton
          color="primary"
          icon="lucide:check-circle"
          block
          size="lg"
          class="font-semibold shadow-sm"
          :loading="submitting"
          @click="submit"
        >
          Guardar producto
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
          <USkeleton class="h-8 w-20 rounded-xl" />
        </li>
      </ul>
      <div
        v-else-if="!postres.length"
        class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <UIcon
            name="lucide:cake"
            class="h-6 w-6"
          />
        </div>
        <p class="text-sm font-semibold text-slate-700">
          Sin catálogo
        </p>
        <p class="mt-1 text-sm text-slate-500 max-w-[200px]">
          Crea tu primer postre.
        </p>
      </div>
      <ul
        v-else
        class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="postre in postres"
          :key="postre._id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80">
              <UIcon
                name="lucide:cake"
                class="h-5 w-5 text-slate-500"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900">
                {{ postre.name }}
              </p>
              <p class="text-xs font-semibold text-slate-500">
                {{ postre.receta?.length || 0 }} insumos
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight text-slate-700 ring-1 ring-inset ring-slate-200/60 shadow-sm">
              {{ formatCurrency(postre.price) }}
            </span>
            <UButton
              color="error"
              variant="ghost"
              icon="lucide:trash-2"
              size="sm"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="deletePostre(postre._id)"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
