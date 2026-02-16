import { useProfile } from '../useProfile'

type CategoryType = 'income' | 'expense'

export function useProfilePage() {
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

  const deleteCustomCategory = async (type: CategoryType, category: string) => {
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

  const toggleDefaultVisibility = (type: CategoryType, category: string) => {
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

  return {
    nameInput,
    loading,
    errorMessage,
    defaultIncomeCategories,
    defaultExpenseCategories,
    hiddenIncomeSet,
    hiddenExpenseSet,
    customIncomeCategories,
    customExpenseCategories,
    toggleDefaultVisibility,
    deleteCustomCategory,
    save
  }
}
