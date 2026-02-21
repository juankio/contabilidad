import { useAuthUser } from '../auth/useAuth'

export function useProfileState() {
  const authUser = useAuthUser()
  const activeProfile = computed(() => {
    const user = authUser.value
    if (!user) {
      return null
    }

    return user.activeProfileId
      ? user.profiles.find(profile => profile._id === user.activeProfileId) ?? null
      : user.profiles[0] ?? null
  })

  const profiles = computed(() => authUser.value?.profiles ?? [])
  const activeProfileId = computed(() => activeProfile.value?._id ?? null)
  const activeProfileName = computed(() => activeProfile.value?.name ?? null)
  const activeIncomeCategories = computed(() => activeProfile.value?.incomeCategories ?? [])
  const activeExpenseCategories = computed(() => activeProfile.value?.expenseCategories ?? [])
  const activeDefaultIncomeCategories = computed(() => activeProfile.value?.defaultIncomeCategories ?? [])
  const activeDefaultExpenseCategories = computed(() => activeProfile.value?.defaultExpenseCategories ?? [])
  const activeHiddenIncomeDefaults = computed(() => activeProfile.value?.hiddenIncomeDefaults ?? [])
  const activeHiddenExpenseDefaults = computed(() => activeProfile.value?.hiddenExpenseDefaults ?? [])
  const activeHiddenIncomeCustoms = computed(() => activeProfile.value?.hiddenIncomeCustoms ?? [])
  const activeHiddenExpenseCustoms = computed(() => activeProfile.value?.hiddenExpenseCustoms ?? [])
  const loading = ref(false)
  const errorMessage = ref('')

  return {
    authUser,
    activeProfile,
    profiles,
    activeProfileId,
    activeProfileName,
    activeIncomeCategories,
    activeExpenseCategories,
    activeDefaultIncomeCategories,
    activeDefaultExpenseCategories,
    activeHiddenIncomeDefaults,
    activeHiddenExpenseDefaults,
    activeHiddenIncomeCustoms,
    activeHiddenExpenseCustoms,
    loading,
    errorMessage
  }
}
