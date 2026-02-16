import { refreshAuthUser, useAuthUser } from './auth/useAuth'

export function useActiveProfile() {
  const authUser = useAuthUser()

  return computed(() => {
    const user = authUser.value
    if (!user) {
      return null
    }

    return user.activeProfileId
      ? user.profiles.find((profile: { _id: string }) => profile._id === user.activeProfileId) ?? null
      : user.profiles[0] ?? null
  })
}

export function useProfile() {
  const activeProfile = useActiveProfile()
  const authUser = useAuthUser()
  const profiles = computed(() => authUser.value?.profiles ?? [])

  const activeProfileName = computed(() => activeProfile.value?.name ?? null)
  const activeProfileId = computed(() => activeProfile.value?._id ?? null)
  const activeIncomeCategories = computed(() => activeProfile.value?.incomeCategories ?? [])
  const activeExpenseCategories = computed(() => activeProfile.value?.expenseCategories ?? [])
  const activeDefaultIncomeCategories = computed(() => activeProfile.value?.defaultIncomeCategories ?? [])
  const activeDefaultExpenseCategories = computed(() => activeProfile.value?.defaultExpenseCategories ?? [])
  const activeHiddenIncomeDefaults = computed(() => activeProfile.value?.hiddenIncomeDefaults ?? [])
  const activeHiddenExpenseDefaults = computed(() => activeProfile.value?.hiddenExpenseDefaults ?? [])

  const loading = ref(false)
  const errorMessage = ref('')

  const updateProfileSettings = async ({
    name,
    hiddenIncomeDefaults,
    hiddenExpenseDefaults
  }: {
    name: string
    hiddenIncomeDefaults?: string[]
    hiddenExpenseDefaults?: string[]
  }) => {
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      errorMessage.value = 'El nombre debe tener al menos 2 caracteres.'
      return false
    }

    if (!activeProfileId.value) {
      errorMessage.value = 'No hay perfil activo.'
      return false
    }

    loading.value = true
    errorMessage.value = ''
    try {
      await $fetch(`/api/profiles/${activeProfileId.value}`, {
        method: 'PATCH',
        body: {
          name: trimmedName,
          ...(hiddenIncomeDefaults ? { hiddenIncomeDefaults } : {}),
          ...(hiddenExpenseDefaults ? { hiddenExpenseDefaults } : {})
        }
      })
      await refreshAuthUser()
      return true
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
        || message
        || 'No se pudo actualizar el perfil'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProfileName = async (name: string) =>
    updateProfileSettings({ name })

  const removeProfileCategory = async (type: 'income' | 'expense', name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return false
    }

    if (!activeProfileId.value || !authUser.value) {
      errorMessage.value = 'No hay perfil activo.'
      return false
    }

    loading.value = true
    errorMessage.value = ''
    try {
      const data = await $fetch<{
        profiles: Array<{
          _id: string
          name: string
          avatarColor: string
          incomeCategories: string[]
          expenseCategories: string[]
          defaultIncomeCategories: string[]
          defaultExpenseCategories: string[]
          hiddenIncomeDefaults: string[]
          hiddenExpenseDefaults: string[]
        }>
        activeProfileId: string | null
      }>(`/api/profiles/${activeProfileId.value}/categories`, {
        method: 'DELETE',
        body: {
          type,
          name: trimmedName
        }
      })

      authUser.value = {
        ...authUser.value,
        profiles: data.profiles ?? [],
        activeProfileId: data.activeProfileId
      }
      return true
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
        || message
        || 'No se pudo eliminar la categoria'
      return false
    } finally {
      loading.value = false
    }
  }

  const refreshProfileCatalog = async () => {
    if (!authUser.value) {
      return false
    }

    try {
      const data = await $fetch<{
        profiles: Array<{
          _id: string
          name: string
          avatarColor: string
          incomeCategories: string[]
          expenseCategories: string[]
          defaultIncomeCategories: string[]
          defaultExpenseCategories: string[]
          hiddenIncomeDefaults: string[]
          hiddenExpenseDefaults: string[]
        }>
        activeProfileId: string | null
      }>('/api/profiles')

      authUser.value = {
        ...authUser.value,
        profiles: data.profiles ?? [],
        activeProfileId: data.activeProfileId
      }
      return true
    } catch {
      return false
    }
  }

  const setActiveProfile = async (profileId: string) => {
    if (!authUser.value) {
      return false
    }

    loading.value = true
    errorMessage.value = ''
    try {
      const data = await $fetch<{
        profiles: Array<{
          _id: string
          name: string
          avatarColor: string
          incomeCategories: string[]
          expenseCategories: string[]
          defaultIncomeCategories: string[]
          defaultExpenseCategories: string[]
          hiddenIncomeDefaults: string[]
          hiddenExpenseDefaults: string[]
        }>
        activeProfileId: string | null
      }>('/api/profiles/active', {
        method: 'POST',
        body: { profileId }
      })

      authUser.value = {
        ...authUser.value,
        profiles: data.profiles ?? [],
        activeProfileId: data.activeProfileId
      }
      return true
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
        || message
        || 'No se pudo cambiar el perfil activo'
      return false
    } finally {
      loading.value = false
    }
  }

  const createProfile = async (name: string) => {
    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      errorMessage.value = 'El nombre del perfil debe tener al menos 2 caracteres.'
      return false
    }

    if (!authUser.value) {
      return false
    }

    loading.value = true
    errorMessage.value = ''
    try {
      const data = await $fetch<{
        profiles: Array<{
          _id: string
          name: string
          avatarColor: string
          incomeCategories: string[]
          expenseCategories: string[]
          defaultIncomeCategories: string[]
          defaultExpenseCategories: string[]
          hiddenIncomeDefaults: string[]
          hiddenExpenseDefaults: string[]
        }>
        activeProfileId: string | null
      }>('/api/profiles', {
        method: 'POST',
        body: { name: trimmedName }
      })

      authUser.value = {
        ...authUser.value,
        profiles: data.profiles ?? [],
        activeProfileId: data.activeProfileId
      }
      return true
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
        || message
        || 'No se pudo crear el perfil'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    profiles,
    activeProfile,
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
    updateProfileName,
    removeProfileCategory,
    updateProfileSettings,
    refreshProfileCatalog,
    setActiveProfile,
    createProfile
  }
}
