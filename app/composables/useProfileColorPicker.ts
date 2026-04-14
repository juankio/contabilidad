import { useTheme, THEMES } from './useTheme'
import { useProfile } from './useProfile'

export function useProfileColorPicker() {
  const { activeColor, setProfileTheme } = useTheme()
  const { activeProfileId, activeProfile, updateProfileThemeColor } = useProfile()
  const saving = ref(false)

  const activeSwatch = computed(
    () => THEMES.find(t => t.key === activeColor.value)?.swatch ?? 'var(--brand-600)'
  )

  async function selectColor(key: typeof THEMES[number]['key']) {
    const profileId = activeProfileId.value
    setProfileTheme(key, profileId ?? 'global')
    if (!profileId || activeProfile.value?.themeColor === key) return
    saving.value = true
    try {
      await updateProfileThemeColor(key)
    } finally {
      saving.value = false
    }
  }

  return { activeColor, activeSwatch, saving, selectColor }
}
