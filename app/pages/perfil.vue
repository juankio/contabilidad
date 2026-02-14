<script setup lang="ts">
const {
  activeProfileName,
  activeIncomeCategories,
  activeExpenseCategories,
  activeDefaultIncomeCategories,
  activeDefaultExpenseCategories,
  activeHiddenIncomeDefaults,
  activeHiddenExpenseDefaults,
  loading,
  errorMessage,
  removeProfileCategory,
  updateProfileSettings
} = useProfile()

const nameInput = ref('')
const hiddenIncomeDefaultsInput = ref<string[]>([])
const hiddenExpenseDefaultsInput = ref<string[]>([])

watch(
  activeProfileName,
  (value) => {
    nameInput.value = value ?? ''
  },
  { immediate: true }
)

watch(
  activeHiddenIncomeDefaults,
  (value) => {
    hiddenIncomeDefaultsInput.value = [...(value ?? [])]
  },
  { immediate: true }
)

watch(
  activeHiddenExpenseDefaults,
  (value) => {
    hiddenExpenseDefaultsInput.value = [...(value ?? [])]
  },
  { immediate: true }
)

const persistProfile = async (navigateAfterSave = false) => {
  const ok = await updateProfileSettings({
    name: nameInput.value,
    hiddenIncomeDefaults: hiddenIncomeDefaultsInput.value,
    hiddenExpenseDefaults: hiddenExpenseDefaultsInput.value
  })
  if (ok && navigateAfterSave) {
    await navigateTo('/')
  }
}

const save = async () => {
  await persistProfile(true)
}

const deleteCustomCategory = async (type: 'income' | 'expense', category: string) => {
  await removeProfileCategory(type, category)
}

const defaultIncomeCategories = computed(() =>
  activeDefaultIncomeCategories.value.length > 0
    ? activeDefaultIncomeCategories.value
    : ['Ventas', 'Servicios', 'Salario', 'Otros']
)
const defaultExpenseCategories = computed(() =>
  activeDefaultExpenseCategories.value.length > 0
    ? activeDefaultExpenseCategories.value
    : ['Alimentacion', 'Servicios', 'Transporte', 'Salud', 'Otros']
)

const hiddenIncomeSet = computed(() =>
  new Set(hiddenIncomeDefaultsInput.value.map(value => value.toLocaleLowerCase()))
)
const hiddenExpenseSet = computed(() =>
  new Set(hiddenExpenseDefaultsInput.value.map(value => value.toLocaleLowerCase()))
)

const toggleDefaultVisibility = (type: 'income' | 'expense', category: string) => {
  const list = type === 'income' ? hiddenIncomeDefaultsInput : hiddenExpenseDefaultsInput
  const key = category.toLocaleLowerCase()
  const next = list.value.filter(item => item.toLocaleLowerCase() !== key)
  if (next.length === list.value.length) {
    next.push(category)
  }
  list.value = next
}

const incomeDefaultKeys = computed(() =>
  new Set(defaultIncomeCategories.value.map(value => value.toLocaleLowerCase()))
)
const expenseDefaultKeys = computed(() =>
  new Set(defaultExpenseCategories.value.map(value => value.toLocaleLowerCase()))
)

const customIncomeCategories = computed(() =>
  activeIncomeCategories.value.filter(category => !incomeDefaultKeys.value.has(category.toLocaleLowerCase()))
)
const customExpenseCategories = computed(() =>
  activeExpenseCategories.value.filter(category => !expenseDefaultKeys.value.has(category.toLocaleLowerCase()))
)
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-4xl px-4 pb-10 pt-6">
      <header class="mb-6 rounded-2xl bg-white/80 p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
          Perfil
        </p>
        <h1 class="text-2xl font-semibold text-slate-900">
          Editar perfil
        </h1>
      </header>

      <div class="rounded-3xl bg-white p-5 shadow-sm">
        <div class="grid gap-2 text-sm text-slate-600">
          <label for="profile-name">Nombre del perfil</label>
          <UInput
            id="profile-name"
            v-model="nameInput"
            type="text"
            size="lg"
            autocomplete="nickname"
          />
        </div>

        <div class="mt-6 grid gap-2 text-sm text-slate-600">
          <p class="font-medium">
            Categorias base de ingresos
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in defaultIncomeCategories"
              :key="`income-${category}`"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
              :class="hiddenIncomeSet.has(category.toLocaleLowerCase()) ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'"
              @click="toggleDefaultVisibility('income', category)"
            >
              {{ category }}
              <span class="font-semibold">
                {{ hiddenIncomeSet.has(category.toLocaleLowerCase()) ? 'Oculta' : 'Visible' }}
              </span>
            </button>
          </div>
        </div>

        <div class="mt-4 grid gap-2 text-sm text-slate-600">
          <p class="font-medium">
            Categorias base de gastos
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in defaultExpenseCategories"
              :key="`expense-${category}`"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
              :class="hiddenExpenseSet.has(category.toLocaleLowerCase()) ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-sky-700'"
              @click="toggleDefaultVisibility('expense', category)"
            >
              {{ category }}
              <span class="font-semibold">
                {{ hiddenExpenseSet.has(category.toLocaleLowerCase()) ? 'Oculta' : 'Visible' }}
              </span>
            </button>
          </div>
        </div>

        <div class="mt-6 grid gap-2 text-sm text-slate-600">
          <p class="font-medium">
            Categorias personalizadas (desde ingresos)
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in customIncomeCategories"
              :key="`custom-income-${category}`"
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800"
              :disabled="loading"
              @click="deleteCustomCategory('income', category)"
            >
              {{ category }}
              <span class="font-semibold text-emerald-900/70">
                Eliminar
              </span>
            </button>
            <p
              v-if="!customIncomeCategories.length"
              class="text-xs text-slate-400"
            >
              Aun no hay categorias personalizadas en ingresos.
            </p>
          </div>
        </div>

        <div class="mt-4 grid gap-2 text-sm text-slate-600">
          <p class="font-medium">
            Categorias personalizadas (desde gastos)
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in customExpenseCategories"
              :key="`custom-expense-${category}`"
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800"
              :disabled="loading"
              @click="deleteCustomCategory('expense', category)"
            >
              {{ category }}
              <span class="font-semibold text-sky-900/70">
                Eliminar
              </span>
            </button>
            <p
              v-if="!customExpenseCategories.length"
              class="text-xs text-slate-400"
            >
              Aun no hay categorias personalizadas en gastos.
            </p>
          </div>
        </div>

        <p class="mt-4 text-sm text-slate-500">
          Las categorias personalizadas se crean al guardar un movimiento con una categoria nueva en Inicio.
        </p>

        <p
          v-if="errorMessage"
          class="mt-3 text-sm text-red-500"
        >
          {{ errorMessage }}
        </p>

        <div class="mt-6 flex items-center justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            :disabled="loading"
            @click="navigateTo('/')"
          >
            Cancelar
          </UButton>
          <UButton
            color="neutral"
            type="button"
            :loading="loading"
            :disabled="nameInput.trim().length < 2"
            @click="save"
          >
            Guardar perfil
          </UButton>
        </div>
      </div>
    </section>
  </main>
</template>
