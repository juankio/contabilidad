export const DEFAULT_PROFILE_ICON = 'i-lucide-user'

export function normalizeProfileIcon(value: string | undefined | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : DEFAULT_PROFILE_ICON
}
