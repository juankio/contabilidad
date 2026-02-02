type Profile = {
  _id: string
  name: string
  avatarColor: string
}

export const useProfiles = async () => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  const { data, pending, refresh } = await useFetch<{
    profiles: Profile[]
    activeProfileId: string | null
  }>('/api/profiles', { headers })

  const profiles = computed(() => data.value?.profiles ?? [])
  const activeProfileId = computed(() => data.value?.activeProfileId ?? null)
  const newName = ref('')
  const errorMessage = ref('')
  const creating = ref(false)

  const selectProfile = async (profileId: string) => {
    await $fetch('/api/profiles/active', {
      method: 'POST',
      body: { profileId }
    })
    await refresh()
    await refreshAuthUser()
    await navigateTo('/')
  }

  const createProfile = async () => {
    if (!newName.value.trim()) return
    errorMessage.value = ''
    creating.value = true
    try {
      await $fetch('/api/profiles', {
        method: 'POST',
        body: { name: newName.value.trim() }
      })
      newName.value = ''
      await refresh()
      await refreshAuthUser()
    } catch (error: unknown) {
      errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
        || 'No se pudo crear el perfil'
    } finally {
      creating.value = false
    }
  }

  const removeProfile = async (profileId: string) => {
    await $fetch(`/api/profiles/${profileId}`, { method: 'DELETE' })
    await refresh()
    await refreshAuthUser()
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await refreshAuthUser()
    await navigateTo('/login')
  }

  return {
    profiles,
    activeProfileId,
    pending,
    newName,
    errorMessage,
    creating,
    selectProfile,
    createProfile,
    removeProfile,
    logout
  }
}
