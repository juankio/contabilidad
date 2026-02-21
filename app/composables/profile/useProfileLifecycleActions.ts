import { getProfileRequestError, isProfileNameValid, syncAuthProfiles } from './profileApiHelpers'
import type { ProfilesResponse } from './profileApiTypes'
import type { useProfileState } from './useProfileState'

type ProfileState = ReturnType<typeof useProfileState>

type RequestConfig = {
  url: string
  method: 'POST' | 'DELETE'
  body?: Record<string, unknown>
  fallback: string
}

export function useProfileLifecycleActions(state: ProfileState) {
  const { authUser, loading, errorMessage } = state

  const runProfileMutation = async ({ url, method, body, fallback }: RequestConfig) => {
    if (!authUser.value) {
      return false
    }

    loading.value = true
    errorMessage.value = ''
    try {
      const data = await $fetch<ProfilesResponse>(url, { method, ...(body ? { body } : {}) })
      syncAuthProfiles(authUser, data)
      return true
    } catch (error: unknown) {
      errorMessage.value = getProfileRequestError(error, fallback)
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
      const data = await $fetch<ProfilesResponse>('/api/profiles')
      syncAuthProfiles(authUser, data)
      return true
    } catch {
      return false
    }
  }

  const setActiveProfile = async (profileId: string) => runProfileMutation({
    url: '/api/profiles/active',
    method: 'POST',
    body: { profileId },
    fallback: 'No se pudo cambiar el perfil activo'
  })

  const createProfile = async (name: string) => {
    const validation = isProfileNameValid(name)
    if (!validation.ok) {
      errorMessage.value = validation.message.replace('El nombre', 'El nombre del perfil')
      return false
    }

    return runProfileMutation({
      url: '/api/profiles',
      method: 'POST',
      body: { name: validation.value },
      fallback: 'No se pudo crear el perfil'
    })
  }

  const deleteProfile = async (profileId: string) => runProfileMutation({
    url: `/api/profiles/${profileId}`,
    method: 'DELETE',
    fallback: 'No se pudo eliminar el perfil'
  })

  return { refreshProfileCatalog, setActiveProfile, createProfile, deleteProfile }
}
