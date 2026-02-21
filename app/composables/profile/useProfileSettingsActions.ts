import { refreshAuthUser } from '../auth/useAuth'
import { getProfileRequestError, isProfileNameValid, syncAuthProfiles } from './profileApiHelpers'
import type { ProfilesResponse } from './profileApiTypes'
import type { useProfileState } from './useProfileState'

type ProfileState = ReturnType<typeof useProfileState>

type UpdatePayload = {
  name: string
  hiddenIncomeDefaults?: string[]
  hiddenExpenseDefaults?: string[]
  hiddenIncomeCustoms?: string[]
  hiddenExpenseCustoms?: string[]
}

export function useProfileSettingsActions(state: ProfileState) {
  const { authUser, activeProfileId, loading, errorMessage } = state

  const updateProfileSettings = async ({
    name,
    hiddenIncomeDefaults,
    hiddenExpenseDefaults,
    hiddenIncomeCustoms,
    hiddenExpenseCustoms
  }: UpdatePayload) => {
    const validation = isProfileNameValid(name)
    if (!validation.ok) {
      errorMessage.value = validation.message
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
          name: validation.value,
          ...(hiddenIncomeDefaults ? { hiddenIncomeDefaults } : {}),
          ...(hiddenExpenseDefaults ? { hiddenExpenseDefaults } : {}),
          ...(hiddenIncomeCustoms ? { hiddenIncomeCustoms } : {}),
          ...(hiddenExpenseCustoms ? { hiddenExpenseCustoms } : {})
        }
      })
      await refreshAuthUser()
      return true
    } catch (error: unknown) {
      errorMessage.value = getProfileRequestError(error, 'No se pudo actualizar el perfil')
      return false
    } finally {
      loading.value = false
    }
  }

  const removeProfileCategory = async (type: 'income' | 'expense', name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName || !activeProfileId.value || !authUser.value) {
      errorMessage.value = 'No hay perfil activo.'
      return false
    }

    loading.value = true
    errorMessage.value = ''
    try {
      const data = await $fetch<ProfilesResponse>(`/api/profiles/${activeProfileId.value}/categories`, {
        method: 'DELETE',
        body: { type, name: trimmedName }
      })
      syncAuthProfiles(authUser, data)
      return true
    } catch (error: unknown) {
      errorMessage.value = getProfileRequestError(error, 'No se pudo eliminar la categoria')
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProfileName = async (name: string) => updateProfileSettings({ name })

  return { updateProfileSettings, updateProfileName, removeProfileCategory }
}
