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
  <section class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center gap-2 text-slate-700">
        <UIcon
          name="lucide:cake"
          class="h-4 w-4"
        />
        <p class="text-sm font-semibold">
          Postres
        </p>
      </div>
      <p class="mt-1 text-xs text-slate-400">
        Precio de venta por postre
      </p>
    </div>

    <!-- Form -->
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <UInput
          v-model="name"
          placeholder="Nombre del postre"
          size="sm"
        />
        <UInput
          v-model="price"
          placeholder="Precio"
          size="sm"
          inputmode="numeric"
        />
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        size="sm"
        block
        @click="submit"
      >
        Agregar postre
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
        v-if="!postres.length"
        class="rounded-2xl border border-dashed border-slate-200 py-6 text-center"
      >
        <p class="text-xs text-slate-400">
          Sin postres registrados
        </p>
      </div>
      <ul
        v-else
        class="space-y-1.5"
      >
        <li
          v-for="postre in postres"
          :key="postre.id"
          class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
        >
          <span class="text-sm font-medium text-slate-800">{{ postre.name }}</span>
          <span
            class="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"
          >
            COP {{ postre.price.toLocaleString() }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
