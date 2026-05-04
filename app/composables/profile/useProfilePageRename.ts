import type { ComputedRef, Ref } from 'vue'

type Inputs = {
  activeProfileId: ComputedRef<string | null>
  nameInput: Ref<string>
  iconInput: Ref<string>
  themeInput: Ref<string>
  resetActionFeedback: () => void
  setActionError: (message: string) => void
  setActionMessage: (message: string) => void
  saveIdentityOnly: (name: string, icon: string, theme: string) => Promise<boolean>
}

export function useProfilePageRename(inputs: Inputs) {
  const showRenameProfileModal = ref(false)
  const renameProfileInput = ref('')
  const renameProfileIcon = ref('')
  const renameProfileTheme = ref('')

  const openRenameProfileModal = () => {
    if (!inputs.activeProfileId.value) {
      inputs.setActionError('No hay perfil activo.')
      return
    }

    inputs.resetActionFeedback()
    renameProfileInput.value = inputs.nameInput.value.trim()
    renameProfileIcon.value = inputs.iconInput.value
    renameProfileTheme.value = inputs.themeInput.value
    showRenameProfileModal.value = true
  }

  const closeRenameProfileModal = () => {
    showRenameProfileModal.value = false
    renameProfileInput.value = ''
    renameProfileIcon.value = ''
    renameProfileTheme.value = ''
    // Si se cancela, devolvemos el tema visual al estado original (borrador)
    useTheme().applyTheme(inputs.themeInput.value)
  }

  // Preview live changes immediately in the UI when the user clicks a color in the modal
  watch(renameProfileTheme, (newTheme) => {
    if (showRenameProfileModal.value && newTheme) {
      useTheme().applyTheme(newTheme)
    }
  })

  const isSavingIdentity = ref(false)

  const confirmRenameProfileDraft = async () => {
    const trimmed = renameProfileInput.value.trim()
    if (trimmed.length < 2) {
      inputs.setActionError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    if (trimmed.length > 32) {
      inputs.setActionError('El nombre no puede superar 32 caracteres.')
      return
    }

    isSavingIdentity.value = true
    const ok = await inputs.saveIdentityOnly(
      trimmed, 
      renameProfileIcon.value || inputs.iconInput.value, 
      renameProfileTheme.value || inputs.themeInput.value
    )
    isSavingIdentity.value = false

    if (ok) {
      inputs.nameInput.value = trimmed
      if (renameProfileIcon.value) {
        inputs.iconInput.value = renameProfileIcon.value
      }
      if (renameProfileTheme.value) {
        inputs.themeInput.value = renameProfileTheme.value
      }
      showRenameProfileModal.value = false
      renameProfileInput.value = ''
      renameProfileIcon.value = ''
      renameProfileTheme.value = ''
      inputs.setActionMessage('Perfil actualizado correctamente.')
    }
  }

  return {
    showRenameProfileModal,
    renameProfileInput,
    renameProfileIcon,
    renameProfileTheme,
    isSavingIdentity,
    openRenameProfileModal,
    closeRenameProfileModal,
    confirmRenameProfileDraft
  }
}
