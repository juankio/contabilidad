export function useActiveProfile() {
  const authUser = useAuthUser()

  return computed(() => {
    const user = authUser.value
    if (!user) {
      return null
    }

    return user.activeProfileId
      ? user.profiles.find((profile) => profile._id === user.activeProfileId) ?? null
      : user.profiles[0] ?? null
  })
}

export function useProfile() {
  const activeProfile = useActiveProfile()

  const activeProfileName = computed(() => activeProfile.value?.name ?? null)
  const activeProfileId = computed(() => activeProfile.value?._id ?? null)

  const loading = ref(false)
  const errorMessage = ref('')

  const updateProfileName = async (name: string) => {
    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      errorMessage.value = 'El nombre debe tener al menos 2 caracteres.'
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
        body: { name: trimmedName }
      })
      await refreshAuthUser()
      return true
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
        || message
        || 'No se pudo actualizar el perfil'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    activeProfile,
    activeProfileId,
    activeProfileName,
    loading,
    errorMessage,
    updateProfileName
  }
}
