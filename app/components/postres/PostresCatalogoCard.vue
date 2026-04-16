<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, addPostre } = usePostres()
const name = ref('')
const price = ref('')
const error = ref('')

const submit = () => {
  error.value = ''
  const value = Number(price.value)
  if (!addPostre(name.value, value)) {
    error.value = 'Completa nombre y precio válido.'
    return
  }
  name.value = ''
  price.value = ''
}
</script>

<template>
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
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
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <UInput
          v-model="name"
          placeholder="Nombre del postre"
          size="lg"
          icon="lucide:tag"
        />
        <UInput
          v-model="price"
          placeholder="0"
          size="lg"
          inputmode="numeric"
          icon="lucide:circle-dollar-sign"
        />
      </div>
      <UButton
        color="primary"
        icon="lucide:plus"
        size="lg"
        block
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
    <div class="mt-5 flex-1">
      <div
        v-if="!postres.length"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
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
        class="space-y-2"
      >
        <li
          v-for="postre in postres"
          :key="postre.id"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
              <span class="text-sm font-bold text-pink-600">{{ postre.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="text-base font-semibold text-slate-900">{{ postre.name }}</span>
          </div>
          <span
            class="rounded-xl bg-pink-50 px-3 py-1 text-sm font-bold tracking-tight text-pink-700 ring-1 ring-pink-500/20"
          >
            ${{ postre.price.toLocaleString() }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
