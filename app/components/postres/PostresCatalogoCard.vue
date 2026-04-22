<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, crear, eliminar, loadingData } = usePostres()
const toast = useToast()

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
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow h-full">
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
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
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <UInput
          v-model="name"
          placeholder="Nombre del postre"
          icon="lucide:tag"
        />
        <UInput
          v-model="price"
          placeholder="0"
          inputmode="numeric"
          icon="lucide:circle-dollar-sign"
        />
      </div>
      <UButton
        color="primary"
        icon="lucide:plus"
        block
        :loading="submitting"
        @click="submit"
      >
        Agregar postre al catálogo
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
            <USkeleton class="h-5 w-24" />
          </div>
          <USkeleton class="h-7 w-16 rounded-xl" />
        </li>
      </ul>
      <div
        v-else-if="!postres.length"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-6 text-center"
      >
        <UIcon
          name="lucide:inbox"
          class="mb-2 h-8 w-8 text-slate-300"
        />
        <p class="text-sm font-medium text-slate-600">
          Catálogo vacío
        </p>
        <p class="text-xs text-slate-500">
          Agrega tu primer postre.
        </p>
      </div>
      <ul
        v-else
        class="space-y-2 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="postre in postres"
          :key="postre._id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-2 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
              <span class="text-sm font-bold text-pink-600">{{ postre.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="text-base font-semibold text-slate-900">{{ postre.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-xl bg-pink-50 px-3 py-1 text-sm font-bold tracking-tight text-pink-700 ring-1 ring-pink-500/20">
              ${{ postre.price.toLocaleString() }}
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
