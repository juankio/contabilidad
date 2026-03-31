export const THEME_COLOR_KEYS = [
  'violet',
  'blue',
  'indigo',
  'sky',
  'teal',
  'emerald',
  'amber',
  'orange',
  'rose',
  'fuchsia',
  'purple',
  'pink',
  'red',
  'lime',
  'cyan',
  'slate'
] as const

export type ThemeColorKey = typeof THEME_COLOR_KEYS[number]

const DEFAULT_THEME_COLOR: ThemeColorKey = 'violet'
const themeColorSet = new Set<string>(THEME_COLOR_KEYS)

export function normalizeThemeColor(value?: string | null): ThemeColorKey {
  if (!value) {
    return DEFAULT_THEME_COLOR
  }

  return themeColorSet.has(value) ? (value as ThemeColorKey) : DEFAULT_THEME_COLOR
}
