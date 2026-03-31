export type ThemeKey =
  | 'violet' | 'blue' | 'indigo' | 'sky'
  | 'teal' | 'emerald' | 'amber' | 'orange'
  | 'rose' | 'fuchsia' | 'slate' | 'red'
  | 'cyan' | 'purple' | 'pink' | 'lime'

export const THEMES: { key: ThemeKey; label: string; swatch: string }[] = [
  { key: 'violet',  label: 'Violeta',   swatch: '#7c3aed' },
  { key: 'blue',    label: 'Azul',      swatch: '#2563eb' },
  { key: 'indigo',  label: 'Índigo',    swatch: '#4f46e5' },
  { key: 'sky',     label: 'Cielo',     swatch: '#0284c7' },
  { key: 'teal',    label: 'Teal',      swatch: '#0d9488' },
  { key: 'emerald', label: 'Esmeralda', swatch: '#059669' },
  { key: 'amber',   label: 'Ámbar',     swatch: '#d97706' },
  { key: 'orange',  label: 'Naranja',   swatch: '#ea580c' },
  { key: 'rose',    label: 'Rosa',      swatch: '#e11d48' },
  { key: 'fuchsia', label: 'Fucsia',    swatch: '#c026d3' },
  { key: 'purple',  label: 'Púrpura',   swatch: '#9333ea' },
  { key: 'pink',    label: 'Rosa claro',swatch: '#db2777' },
  { key: 'red',     label: 'Rojo',      swatch: '#dc2626' },
  { key: 'lime',    label: 'Lima',      swatch: '#65a30d' },
  { key: 'cyan',    label: 'Cian',      swatch: '#0891b2' },
  { key: 'slate',   label: 'Pizarra',   swatch: '#475569' },
]

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * Applies a Tailwind color to both --color-primary-* (Nuxt UI) and --brand-* (custom)
 * by referencing the existing Tailwind CSS vars like var(--color-violet-600).
 */
function applyColorVars(colorName: string) {
  const el = document.documentElement

  // Nuxt UI primary colors
  SHADES.forEach(shade => {
    el.style.setProperty(`--color-primary-${shade}`, `var(--color-${colorName}-${shade})`)
  })

  // Custom brand vars used by our components
  el.style.setProperty('--brand-50',  `var(--color-${colorName}-50)`)
  el.style.setProperty('--brand-100', `var(--color-${colorName}-100)`)
  el.style.setProperty('--brand-200', `var(--color-${colorName}-200)`)
  el.style.setProperty('--brand-300', `var(--color-${colorName}-300)`)
  el.style.setProperty('--brand-400', `var(--color-${colorName}-400)`)
  el.style.setProperty('--brand-600', `var(--color-${colorName}-600)`)
  el.style.setProperty('--brand-700', `var(--color-${colorName}-700)`)
}

const STORAGE_PREFIX = 'theme:'

export function useTheme() {
  const activeColor = useState<ThemeKey>('app:theme-color', () => 'violet')

  function applyTheme(colorKey: ThemeKey) {
    if (import.meta.client) {
      applyColorVars(colorKey)
    }
    activeColor.value = colorKey
  }

  function saveProfileTheme(profileId: string, colorKey: ThemeKey) {
    if (import.meta.client) {
      localStorage.setItem(`${STORAGE_PREFIX}${profileId}`, colorKey)
    }
  }

  function loadProfileTheme(profileId: string) {
    if (!import.meta.client) return
    const saved = (localStorage.getItem(`${STORAGE_PREFIX}${profileId}`) as ThemeKey | null) || 'violet'
    applyTheme(saved)
  }

  function setProfileTheme(colorKey: ThemeKey, profileId: string) {
    applyTheme(colorKey)
    saveProfileTheme(profileId, colorKey)
  }

  function initTheme(profileId?: string | null) {
    if (!import.meta.client) return
    const key = profileId ? `${STORAGE_PREFIX}${profileId}` : `${STORAGE_PREFIX}global`
    const saved = (localStorage.getItem(key) as ThemeKey | null) || 'violet'
    applyTheme(saved)
  }

  return { activeColor, THEMES, applyTheme, loadProfileTheme, setProfileTheme, initTheme }
}
