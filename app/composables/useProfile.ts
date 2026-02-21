import { useAuthUser } from './auth/useAuth'
import { useProfileLifecycleActions } from './profile/useProfileLifecycleActions'
import { useProfileSettingsActions } from './profile/useProfileSettingsActions'
import { useProfileState } from './profile/useProfileState'

export function useActiveProfile() {
  const authUser = useAuthUser()

  return computed(() => {
    const user = authUser.value
    if (!user) {
      return null
    }

    return user.activeProfileId
      ? user.profiles.find(profile => profile._id === user.activeProfileId) ?? null
      : user.profiles[0] ?? null
  })
}

export function useProfile() {
  const state = useProfileState()
  const settings = useProfileSettingsActions(state)
  const lifecycle = useProfileLifecycleActions(state)

  return {
    profiles: state.profiles,
    activeProfile: state.activeProfile,
    activeProfileId: state.activeProfileId,
    activeProfileName: state.activeProfileName,
    activeIncomeCategories: state.activeIncomeCategories,
    activeExpenseCategories: state.activeExpenseCategories,
    activeDefaultIncomeCategories: state.activeDefaultIncomeCategories,
    activeDefaultExpenseCategories: state.activeDefaultExpenseCategories,
    activeHiddenIncomeDefaults: state.activeHiddenIncomeDefaults,
    activeHiddenExpenseDefaults: state.activeHiddenExpenseDefaults,
    activeHiddenIncomeCustoms: state.activeHiddenIncomeCustoms,
    activeHiddenExpenseCustoms: state.activeHiddenExpenseCustoms,
    loading: state.loading,
    errorMessage: state.errorMessage,
    updateProfileName: settings.updateProfileName,
    removeProfileCategory: settings.removeProfileCategory,
    updateProfileSettings: settings.updateProfileSettings,
    refreshProfileCatalog: lifecycle.refreshProfileCatalog,
    setActiveProfile: lifecycle.setActiveProfile,
    createProfile: lifecycle.createProfile,
    deleteProfile: lifecycle.deleteProfile
  }
}
