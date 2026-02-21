import type { ComputedRef, Ref } from 'vue'
import { refreshProfilePageData } from './useProfilePageRefresh'

type ProfileLite = { _id: string, name: string }

type Inputs = {
  profiles: ComputedRef<ProfileLite[]>
  activeProfileId: ComputedRef<string | null>
  deleteProfile: (profileId: string) => Promise<boolean>
  errorMessage: Ref<string>
  resetActionFeedback: () => void
  setActionError: (message: string) => void
  setActionMessage: (message: string) => void
}

export function useProfilePageDelete(inputs: Inputs) {
  const showDeleteProfileModal = ref(false)
  const deleteProfileNameInput = ref('')
  const deleteProfileId = ref<string | null>(null)
  const canDeleteProfiles = computed(() => inputs.profiles.value.length > 1)
  const profileToDelete = computed(() =>
    inputs.profiles.value.find(profile => profile._id === deleteProfileId.value) ?? null
  )

  const openDeleteProfileModal = (profileId?: string) => {
    const targetId = profileId ?? inputs.activeProfileId.value
    if (!targetId) {
      inputs.setActionError('No hay perfil activo.')
      return
    }

    inputs.resetActionFeedback()
    deleteProfileId.value = targetId
    deleteProfileNameInput.value = ''
    showDeleteProfileModal.value = true
  }

  const closeDeleteProfileModal = () => {
    showDeleteProfileModal.value = false
    deleteProfileId.value = null
    deleteProfileNameInput.value = ''
  }

  const confirmDeleteProfile = async () => {
    const target = profileToDelete.value
    if (!target) return inputs.setActionError('No se encontro el perfil a eliminar.')
    if (!canDeleteProfiles.value) return inputs.setActionError('Debes mantener al menos un perfil.')
    if (deleteProfileNameInput.value.trim() !== target.name.trim()) {
      return inputs.setActionError('Escribe el nombre exacto del perfil para confirmar.')
    }

    inputs.resetActionFeedback()
    const ok = await inputs.deleteProfile(target._id)
    if (!ok) {
      return inputs.setActionError(inputs.errorMessage.value || 'No se pudo eliminar el perfil.')
    }

    await refreshProfilePageData()
    closeDeleteProfileModal()
    inputs.setActionMessage('Perfil eliminado permanentemente.')
  }

  return {
    showDeleteProfileModal,
    deleteProfileNameInput,
    canDeleteProfiles,
    profileToDelete,
    openDeleteProfileModal,
    closeDeleteProfileModal,
    confirmDeleteProfile
  }
}
