import type { Ref } from 'vue'
import { refreshProfilePageData } from './useProfilePageRefresh'
import { DEFAULT_PROFILE_ICON } from '../../utils/profile-icons'

type Inputs = {
  createProfile: (name: string, avatarIcon?: string, themeColor?: string) => Promise<boolean>
  setActiveProfile: (profileId: string) => Promise<boolean>
  errorMessage: Ref<string>
  resetActionFeedback: () => void
  setActionError: (message: string) => void
  setActionMessage: (message: string) => void
}

export function useProfilePageCreateActivate(inputs: Inputs) {
  const newProfileName = ref('')
  const newProfileIcon = ref(DEFAULT_PROFILE_ICON)
  const newProfileTheme = ref('violet')
  const showCreateProfileModal = ref(false)

  const createNewProfile = async (name?: string, icon?: string, theme?: string) => {
    const targetName = (name ?? newProfileName.value).trim()
    inputs.resetActionFeedback()
    const ok = await inputs.createProfile(targetName, icon ?? newProfileIcon.value, theme ?? newProfileTheme.value)
    if (!ok) {
      inputs.setActionError(inputs.errorMessage.value || 'No se pudo crear el perfil.')
      return false
    }

    await refreshProfilePageData()
    newProfileName.value = ''
    newProfileIcon.value = DEFAULT_PROFILE_ICON
    newProfileTheme.value = 'violet'
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
    newProfileIcon.value = DEFAULT_PROFILE_ICON
    newProfileTheme.value = useTheme().activeColor.value || 'violet'
    showCreateProfileModal.value = true
  }

  const closeCreateProfileModal = () => {
    showCreateProfileModal.value = false
    newProfileName.value = ''
    newProfileIcon.value = DEFAULT_PROFILE_ICON
    newProfileTheme.value = 'violet'
    useTheme().initTheme() // Revert to currently active theme if they cancel
  }

  watch(newProfileTheme, (newTheme) => {
    if (showCreateProfileModal.value && newTheme) {
      useTheme().applyTheme(newTheme)
    }
  })

  const confirmCreateProfile = async () => {
    const ok = await createNewProfile(undefined, newProfileIcon.value, newProfileTheme.value)
    if (ok) {
      showCreateProfileModal.value = false
    }
  }

  return {
    newProfileName,
    newProfileIcon,
    newProfileTheme,
    showCreateProfileModal,
    createNewProfile,
    activateProfile,
    openCreateProfileModal,
    closeCreateProfileModal,
    confirmCreateProfile
  }
}
