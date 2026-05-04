export type AuthProfile = {
  _id: string
  name: string
  avatarColor: string
  themeColor: string
  avatarIcon: string
  modules: string[]
  incomeCategories: string[]
  expenseCategories: string[]
  defaultIncomeCategories: string[]
  defaultExpenseCategories: string[]
  hiddenIncomeDefaults: string[]
  hiddenExpenseDefaults: string[]
  hiddenIncomeCustoms: string[]
  hiddenExpenseCustoms: string[]
}

export type AuthUser = {
  id: string
  email: string
  profiles: AuthProfile[]
  activeProfileId?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const activeProfile = computed(() => {
    if (!user.value) return null
    return user.value.activeProfileId
      ? user.value.profiles.find(profile => profile._id === user.value?.activeProfileId) ?? null
      : user.value.profiles[0] ?? null
  })

  const refreshAuthUser = async () => {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    const data = await $fetch<{ user: AuthUser | null }>('/api/auth/me', { headers })
    user.value = data?.user ?? null
    return user.value
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error('Logout error', e)
    } finally {
      user.value = null
      navigateTo('/login')
    }
  }

  return {
    user,
    isAuthenticated,
    activeProfile,
    refreshAuthUser,
    logout
  }
})
