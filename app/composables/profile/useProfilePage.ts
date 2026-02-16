import { useProfile } from '../useProfile'

type CategoryType = 'income' | 'expense'

export function useProfilePage() {
  const {
    profiles,
    activeProfileId,
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
    updateProfileSettings,
    setActiveProfile,
    createProfile
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

  const newProfileName = ref('')
  const profileActionMessage = ref('')
  const profileActionError = ref('')

  const createNewProfile = async (name?: string) => {
    const targetName = (name ?? newProfileName.value).trim()
    profileActionMessage.value = ''
    profileActionError.value = ''
    const ok = await createProfile(targetName)
    if (!ok) {
      profileActionError.value = errorMessage.value || 'No se pudo crear el perfil.'
      return false
    }
    await refreshNuxtData(['resumen', 'movimientos', 'categorias', 'gastos', 'gastos-grouped', 'estadisticas'])
    newProfileName.value = ''
    profileActionMessage.value = 'Perfil creado.'
    return true
  }

  const activateProfile = async (profileId: string) => {
    profileActionMessage.value = ''
    profileActionError.value = ''
    const ok = await setActiveProfile(profileId)
    if (!ok) {
      profileActionError.value = errorMessage.value || 'No se pudo activar el perfil.'
      return false
    }
    await refreshNuxtData(['resumen', 'movimientos', 'categorias', 'gastos', 'gastos-grouped', 'estadisticas'])
    profileActionMessage.value = 'Perfil activo actualizado.'
    return true
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
    profiles,
    activeProfileId,
    loading,
    errorMessage,
    newProfileName,
    profileActionMessage,
    profileActionError,
    defaultIncomeCategories,
    defaultExpenseCategories,
    hiddenIncomeSet,
    hiddenExpenseSet,
    customIncomeCategories,
    customExpenseCategories,
    toggleDefaultVisibility,
    deleteCustomCategory,
    createNewProfile,
    activateProfile,
    save
  }
}
