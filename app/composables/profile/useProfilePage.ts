import { useProfilePageCategories } from './useProfilePageCategories'
import { useProfilePageCreateActivate } from './useProfilePageCreateActivate'
import { useProfilePageData } from './useProfilePageData'
import { useProfilePageDelete } from './useProfilePageDelete'
import { useProfilePageFeedback } from './useProfilePageFeedback'
import { useProfilePageRename } from './useProfilePageRename'

export function useProfilePage() {
  const data = useProfilePageData()
  const feedback = useProfilePageFeedback()
  const categories = useProfilePageCategories({
    activeIncomeCategories: data.activeIncomeCategories,
    activeExpenseCategories: data.activeExpenseCategories,
    activeDefaultIncomeCategories: data.activeDefaultIncomeCategories,
    activeDefaultExpenseCategories: data.activeDefaultExpenseCategories,
    activeHiddenIncomeCustoms: data.activeHiddenIncomeCustoms,
    activeHiddenExpenseCustoms: data.activeHiddenExpenseCustoms,
    hiddenIncomeDefaultsInput: data.hiddenIncomeDefaultsInput,
    hiddenExpenseDefaultsInput: data.hiddenExpenseDefaultsInput,
    hiddenIncomeCustomsInput: data.hiddenIncomeCustomsInput,
    hiddenExpenseCustomsInput: data.hiddenExpenseCustomsInput
  })

  const createActivate = useProfilePageCreateActivate({
    createProfile: data.createProfile,
    setActiveProfile: data.setActiveProfile,
    errorMessage: data.errorMessage,
    resetActionFeedback: feedback.resetActionFeedback,
    setActionError: feedback.setActionError,
    setActionMessage: feedback.setActionMessage
  })

  const rename = useProfilePageRename({
    activeProfileId: data.activeProfileId,
    nameInput: data.nameInput,
    resetActionFeedback: feedback.resetActionFeedback,
    setActionError: feedback.setActionError,
    setActionMessage: feedback.setActionMessage
  })

  const deletion = useProfilePageDelete({
    profiles: data.profiles,
    activeProfileId: data.activeProfileId,
    deleteProfile: data.deleteProfile,
    errorMessage: data.errorMessage,
    resetActionFeedback: feedback.resetActionFeedback,
    setActionError: feedback.setActionError,
    setActionMessage: feedback.setActionMessage
  })

  return {
    nameInput: data.nameInput,
    hasUnsavedChanges: data.hasUnsavedChanges,
    canSaveProfile: data.canSaveProfile,
    profiles: data.profiles,
    activeProfileId: data.activeProfileId,
    loading: data.loading,
    errorMessage: data.errorMessage,
    save: data.save,
    deleteCustomCategory: data.deleteCustomCategory,
    ...feedback,
    ...categories,
    ...createActivate,
    ...rename,
    ...deletion
  }
}
