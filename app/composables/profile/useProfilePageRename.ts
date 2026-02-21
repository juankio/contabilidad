import type { ComputedRef, Ref } from 'vue'

type Inputs = {
  activeProfileId: ComputedRef<string | null>
  nameInput: Ref<string>
  resetActionFeedback: () => void
  setActionError: (message: string) => void
  setActionMessage: (message: string) => void
}

export function useProfilePageRename(inputs: Inputs) {
  const showRenameProfileModal = ref(false)
  const renameProfileInput = ref('')

  const openRenameProfileModal = () => {
    if (!inputs.activeProfileId.value) {
      inputs.setActionError('No hay perfil activo.')
      return
    }

    inputs.resetActionFeedback()
    renameProfileInput.value = inputs.nameInput.value.trim()
    showRenameProfileModal.value = true
  }

  const closeRenameProfileModal = () => {
    showRenameProfileModal.value = false
    renameProfileInput.value = ''
  }

  const confirmRenameProfileDraft = () => {
    const trimmed = renameProfileInput.value.trim()
    if (trimmed.length < 2) {
      inputs.setActionError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    if (trimmed.length > 32) {
      inputs.setActionError('El nombre no puede superar 32 caracteres.')
      return
    }

    inputs.nameInput.value = trimmed
    showRenameProfileModal.value = false
    renameProfileInput.value = ''
    inputs.setActionMessage('Nombre actualizado. Pulsa "Guardar perfil" para aplicar el cambio.')
  }

  return {
    showRenameProfileModal,
    renameProfileInput,
    openRenameProfileModal,
    closeRenameProfileModal,
    confirmRenameProfileDraft
  }
}
