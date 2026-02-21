import type { Ref } from 'vue'
import { refreshProfilePageData } from './useProfilePageRefresh'

type Inputs = {
  createProfile: (name: string) => Promise<boolean>
  setActiveProfile: (profileId: string) => Promise<boolean>
  errorMessage: Ref<string>
  resetActionFeedback: () => void
  setActionError: (message: string) => void
  setActionMessage: (message: string) => void
}

export function useProfilePageCreateActivate(inputs: Inputs) {
  const newProfileName = ref('')
  const showCreateProfileModal = ref(false)

  const createNewProfile = async (name?: string) => {
    const targetName = (name ?? newProfileName.value).trim()
    inputs.resetActionFeedback()
    const ok = await inputs.createProfile(targetName)
    if (!ok) {
      inputs.setActionError(inputs.errorMessage.value || 'No se pudo crear el perfil.')
      return false
    }

    await refreshProfilePageData()
    newProfileName.value = ''
    inputs.setActionMessage('Perfil creado.')
    return true
  }

  const activateProfile = async (profileId: string) => {
    inputs.resetActionFeedback()
    const ok = await inputs.setActiveProfile(profileId)
    if (!ok) {
      inputs.setActionError(inputs.errorMessage.value || 'No se pudo activar el perfil.')
      return false
    }

    await refreshProfilePageData()
    inputs.setActionMessage('Perfil activo actualizado.')
    return true
  }

  const openCreateProfileModal = (prefillName = '') => {
    inputs.resetActionFeedback()
    newProfileName.value = prefillName.trim()
    showCreateProfileModal.value = true
  }

  const closeCreateProfileModal = () => {
    showCreateProfileModal.value = false
    newProfileName.value = ''
  }

  const confirmCreateProfile = async () => {
    const ok = await createNewProfile()
    if (ok) {
      showCreateProfileModal.value = false
    }
  }

  return {
    newProfileName,
    showCreateProfileModal,
    createNewProfile,
    activateProfile,
    openCreateProfileModal,
    closeCreateProfileModal,
    confirmCreateProfile
  }
}
