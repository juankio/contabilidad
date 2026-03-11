type ProfileLite = {
  _id: string
  name: string
  avatarIcon?: string
}

type ProfileItem = {
  label: string
  value: string
  icon?: string
}

export function useHeaderProfiles() {
  const mobileMenuOpen = ref(false)
  const switchingProfile = ref(false)
  const profileSelection = ref('')

  const { profiles, activeProfileId, setActiveProfile } = useProfile()

  const profileList = computed<ProfileLite[]>(() =>
    profiles.value.map(profile => ({
      _id: profile._id,
      name: profile.name,
      avatarIcon: profile.avatarIcon
    }))
  )

  const profileItems = computed<ProfileItem[]>(() =>
    profileList.value.map(profile => ({
      label: profile.name,
      value: profile._id,
      icon: profile.avatarIcon
    }))
  )

  watch(
    activeProfileId,
    (value) => {
      profileSelection.value = value ?? ''
    },
    { immediate: true }
  )

  const applyProfileChange = async (nextProfileId: string, closeMenu = false) => {
    if (!nextProfileId || nextProfileId === activeProfileId.value) {
      if (closeMenu) {
        mobileMenuOpen.value = false
      }
      return
    }

    switchingProfile.value = true
    try {
      const changed = await setActiveProfile(nextProfileId)
      if (changed) {
        await refreshNuxtData(['resumen', 'movimientos', 'categorias', 'gastos', 'gastos-grouped', 'estadisticas', 'prestamos'])
      }
    } finally {
      switchingProfile.value = false
      if (closeMenu) {
        mobileMenuOpen.value = false
      }
    }
  }

  const onDesktopProfileSelect = async (profileId: string) => {
    profileSelection.value = profileId
    await applyProfileChange(profileId)
  }

  const onMobileProfileSelect = async (profileId: string) => {
    profileSelection.value = profileId
    await applyProfileChange(profileId, true)
  }

  return {
    mobileMenuOpen,
    switchingProfile,
    profileSelection,
    activeProfileId,
    profileList,
    profileItems,
    onDesktopProfileSelect,
    onMobileProfileSelect
  }
}
