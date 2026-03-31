export const THEME_KEYS = [
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
  'slate',
  'red',
  'cyan',
  'purple',
  'pink',
  'lime'
] as const

export type ThemeKey = (typeof THEME_KEYS)[number]

type ThemeOption = {
  key: ThemeKey
  label: string
  swatch: string
}

export const THEMES: ThemeOption[] = [
  { key: 'violet', label: 'Violeta', swatch: '#7c3aed' },
  { key: 'blue', label: 'Azul', swatch: '#2563eb' },
  { key: 'indigo', label: 'Índigo', swatch: '#4f46e5' },
  { key: 'sky', label: 'Cielo', swatch: '#0284c7' },
  { key: 'teal', label: 'Teal', swatch: '#0d9488' },
  { key: 'emerald', label: 'Esmeralda', swatch: '#059669' },
  { key: 'amber', label: 'Ámbar', swatch: '#d97706' },
  { key: 'orange', label: 'Naranja', swatch: '#ea580c' },
  { key: 'rose', label: 'Rosa', swatch: '#e11d48' },
  { key: 'fuchsia', label: 'Fucsia', swatch: '#c026d3' },
  { key: 'purple', label: 'Púrpura', swatch: '#9333ea' },
  { key: 'pink', label: 'Rosa claro', swatch: '#db2777' },
  { key: 'red', label: 'Rojo', swatch: '#dc2626' },
  { key: 'lime', label: 'Lima', swatch: '#65a30d' },
  { key: 'cyan', label: 'Cian', swatch: '#0891b2' },
  { key: 'slate', label: 'Pizarra', swatch: '#475569' }
]

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const THEME_KEY_SET = new Set<string>(THEME_KEYS)
const DEFAULT_THEME_KEY: ThemeKey = 'violet'

type ThemePalette = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
]

const THEME_PALETTES: Record<ThemeKey, ThemePalette> = {
  violet: [
    'oklch(96.9% 0.016 293.756)',
    'oklch(94.3% 0.029 294.588)',
    'oklch(89.4% 0.057 293.283)',
    'oklch(81.1% 0.111 293.571)',
    'oklch(70.2% 0.183 293.541)',
    'oklch(60.6% 0.25 292.717)',
    'oklch(54.1% 0.281 293.009)',
    'oklch(49.1% 0.27 292.581)',
    'oklch(43.2% 0.232 292.759)',
    'oklch(38% 0.189 293.745)',
    'oklch(28.3% 0.141 291.089)'
  ],
  blue: [
    'oklch(97% 0.014 254.604)',
    'oklch(93.2% 0.032 255.585)',
    'oklch(88.2% 0.059 254.128)',
    'oklch(80.9% 0.105 251.813)',
    'oklch(70.7% 0.165 254.624)',
    'oklch(62.3% 0.214 259.815)',
    'oklch(54.6% 0.245 262.881)',
    'oklch(48.8% 0.243 264.376)',
    'oklch(42.4% 0.199 265.638)',
    'oklch(37.9% 0.146 265.522)',
    'oklch(28.2% 0.091 267.935)'
  ],
  indigo: [
    'oklch(96.2% 0.018 272.314)',
    'oklch(93% 0.034 272.788)',
    'oklch(87% 0.065 274.039)',
    'oklch(78.5% 0.115 274.713)',
    'oklch(67.3% 0.182 276.935)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(51.1% 0.262 276.966)',
    'oklch(45.7% 0.24 277.023)',
    'oklch(39.8% 0.195 277.366)',
    'oklch(35.9% 0.144 278.697)',
    'oklch(25.7% 0.09 281.288)'
  ],
  sky: [
    'oklch(97.7% 0.013 236.62)',
    'oklch(95.1% 0.026 236.824)',
    'oklch(90.1% 0.058 230.902)',
    'oklch(82.8% 0.111 230.318)',
    'oklch(74.6% 0.16 232.661)',
    'oklch(68.5% 0.169 237.323)',
    'oklch(58.8% 0.158 241.966)',
    'oklch(50% 0.134 242.749)',
    'oklch(44.3% 0.11 240.79)',
    'oklch(39.1% 0.09 240.876)',
    'oklch(29.3% 0.066 243.157)'
  ],
  teal: [
    'oklch(98.4% 0.014 180.72)',
    'oklch(95.3% 0.051 180.801)',
    'oklch(91% 0.096 180.426)',
    'oklch(85.5% 0.138 181.071)',
    'oklch(77.7% 0.152 181.912)',
    'oklch(70.4% 0.14 182.503)',
    'oklch(60% 0.118 184.704)',
    'oklch(51.1% 0.096 186.391)',
    'oklch(43.7% 0.078 188.216)',
    'oklch(38.6% 0.063 188.416)',
    'oklch(27.7% 0.046 192.524)'
  ],
  emerald: [
    'oklch(97.9% 0.021 166.113)',
    'oklch(95% 0.052 163.051)',
    'oklch(90.5% 0.093 164.15)',
    'oklch(84.5% 0.143 164.978)',
    'oklch(76.5% 0.177 163.223)',
    'oklch(69.6% 0.17 162.48)',
    'oklch(59.6% 0.145 163.225)',
    'oklch(50.8% 0.118 165.612)',
    'oklch(43.2% 0.095 166.913)',
    'oklch(37.8% 0.077 168.94)',
    'oklch(26.2% 0.051 172.552)'
  ],
  amber: [
    'oklch(98.7% 0.022 95.277)',
    'oklch(96.2% 0.059 95.617)',
    'oklch(92.4% 0.12 95.746)',
    'oklch(87.9% 0.169 91.605)',
    'oklch(82.8% 0.189 84.429)',
    'oklch(76.9% 0.188 70.08)',
    'oklch(66.6% 0.179 58.318)',
    'oklch(55.5% 0.163 48.998)',
    'oklch(47.3% 0.137 46.201)',
    'oklch(41.4% 0.112 45.904)',
    'oklch(27.9% 0.077 45.635)'
  ],
  orange: [
    'oklch(98% 0.016 73.684)',
    'oklch(95.4% 0.038 75.164)',
    'oklch(90.1% 0.076 70.697)',
    'oklch(83.7% 0.128 66.29)',
    'oklch(75% 0.183 55.934)',
    'oklch(70.5% 0.213 47.604)',
    'oklch(64.6% 0.222 41.116)',
    'oklch(55.3% 0.195 38.402)',
    'oklch(47% 0.157 37.304)',
    'oklch(40.8% 0.123 38.172)',
    'oklch(26.6% 0.079 36.259)'
  ],
  rose: [
    'oklch(96.9% 0.015 12.422)',
    'oklch(94.1% 0.03 12.58)',
    'oklch(89.2% 0.058 10.001)',
    'oklch(81% 0.117 11.638)',
    'oklch(71.2% 0.194 13.428)',
    'oklch(64.5% 0.246 16.439)',
    'oklch(58.6% 0.253 17.585)',
    'oklch(51.4% 0.222 16.935)',
    'oklch(45.5% 0.188 13.697)',
    'oklch(41% 0.159 10.272)',
    'oklch(27.1% 0.105 12.094)'
  ],
  fuchsia: [
    'oklch(97.7% 0.017 320.058)',
    'oklch(95.2% 0.037 318.852)',
    'oklch(90.3% 0.076 319.62)',
    'oklch(83.3% 0.145 321.434)',
    'oklch(74% 0.238 322.16)',
    'oklch(66.7% 0.295 322.15)',
    'oklch(59.1% 0.293 322.896)',
    'oklch(51.8% 0.253 323.949)',
    'oklch(45.2% 0.211 324.591)',
    'oklch(40.1% 0.17 325.612)',
    'oklch(29.3% 0.136 325.661)'
  ],
  slate: [
    'oklch(98.4% 0.003 247.858)',
    'oklch(96.8% 0.007 247.896)',
    'oklch(92.9% 0.013 255.508)',
    'oklch(86.9% 0.022 252.894)',
    'oklch(70.4% 0.04 256.788)',
    'oklch(55.4% 0.046 257.417)',
    'oklch(44.6% 0.043 257.281)',
    'oklch(37.2% 0.044 257.287)',
    'oklch(27.9% 0.041 260.031)',
    'oklch(20.8% 0.042 265.755)',
    'oklch(12.9% 0.042 264.695)'
  ],
  red: [
    'oklch(97.1% 0.013 17.38)',
    'oklch(93.6% 0.032 17.717)',
    'oklch(88.5% 0.062 18.334)',
    'oklch(80.8% 0.114 19.571)',
    'oklch(70.4% 0.191 22.216)',
    'oklch(63.7% 0.237 25.331)',
    'oklch(57.7% 0.245 27.325)',
    'oklch(50.5% 0.213 27.518)',
    'oklch(44.4% 0.177 26.899)',
    'oklch(39.6% 0.141 25.723)',
    'oklch(25.8% 0.092 26.042)'
  ],
  cyan: [
    'oklch(98.4% 0.019 200.873)',
    'oklch(95.6% 0.045 203.388)',
    'oklch(91.7% 0.08 205.041)',
    'oklch(86.5% 0.127 207.078)',
    'oklch(78.9% 0.154 211.53)',
    'oklch(71.5% 0.143 215.221)',
    'oklch(60.9% 0.126 221.723)',
    'oklch(52% 0.105 223.128)',
    'oklch(45% 0.085 224.283)',
    'oklch(39.8% 0.07 227.392)',
    'oklch(30.2% 0.056 229.695)'
  ],
  purple: [
    'oklch(97.7% 0.014 308.299)',
    'oklch(94.6% 0.033 307.174)',
    'oklch(90.2% 0.063 306.703)',
    'oklch(82.7% 0.119 306.383)',
    'oklch(71.4% 0.203 305.504)',
    'oklch(62.7% 0.265 303.9)',
    'oklch(55.8% 0.288 302.321)',
    'oklch(49.6% 0.265 301.924)',
    'oklch(43.8% 0.218 303.724)',
    'oklch(38.1% 0.176 304.987)',
    'oklch(29.1% 0.149 302.717)'
  ],
  pink: [
    'oklch(97.1% 0.014 343.198)',
    'oklch(94.8% 0.028 342.258)',
    'oklch(89.9% 0.061 343.231)',
    'oklch(82.3% 0.12 346.018)',
    'oklch(71.8% 0.202 349.761)',
    'oklch(65.6% 0.241 354.308)',
    'oklch(59.2% 0.249 0.584)',
    'oklch(52.5% 0.223 3.958)',
    'oklch(45.9% 0.187 3.815)',
    'oklch(40.8% 0.153 2.432)',
    'oklch(28.4% 0.109 3.907)'
  ],
  lime: [
    'oklch(98.6% 0.031 120.757)',
    'oklch(96.7% 0.067 122.328)',
    'oklch(93.8% 0.127 124.321)',
    'oklch(89.7% 0.196 126.665)',
    'oklch(84.1% 0.238 128.85)',
    'oklch(76.8% 0.233 130.85)',
    'oklch(64.8% 0.2 131.684)',
    'oklch(53.2% 0.157 131.589)',
    'oklch(45.3% 0.124 130.933)',
    'oklch(40.5% 0.101 131.063)',
    'oklch(27.4% 0.072 132.109)'
  ]
}

export function normalizeThemeKey(value?: string | null): ThemeKey {
  if (!value) {
    return DEFAULT_THEME_KEY
  }

  return THEME_KEY_SET.has(value) ? (value as ThemeKey) : DEFAULT_THEME_KEY
}

/**
 * Applies the selected palette to both Nuxt UI vars and custom brand vars.
 * We set explicit color values to avoid relying on stripped Tailwind vars.
 */
function applyColorVars(colorName: string) {
  const el = document.documentElement
  const key = normalizeThemeKey(colorName)
  const palette = THEME_PALETTES[key]
  const defaultPalette = THEME_PALETTES[DEFAULT_THEME_KEY]

  const get = (shade: (typeof SHADES)[number]): string => {
    switch (shade) {
      case 50: return palette[0] || defaultPalette[0]
      case 100: return palette[1] || defaultPalette[1]
      case 200: return palette[2] || defaultPalette[2]
      case 300: return palette[3] || defaultPalette[3]
      case 400: return palette[4] || defaultPalette[4]
      case 500: return palette[5] || defaultPalette[5]
      case 600: return palette[6] || defaultPalette[6]
      case 700: return palette[7] || defaultPalette[7]
      case 800: return palette[8] || defaultPalette[8]
      case 900: return palette[9] || defaultPalette[9]
      case 950: return palette[10] || defaultPalette[10]
      default: return defaultPalette[5]
    }
  }

  el.style.setProperty('--ui-primary', get(500))
  el.style.setProperty('--color-primary', get(500))

  SHADES.forEach((shade) => {
    const value = get(shade)
    el.style.setProperty(`--ui-color-primary-${shade}`, value)
    el.style.setProperty(`--color-primary-${shade}`, value)
  })

  el.style.setProperty('--brand-50', get(50))
  el.style.setProperty('--brand-100', get(100))
  el.style.setProperty('--brand-200', get(200))
  el.style.setProperty('--brand-300', get(300))
  el.style.setProperty('--brand-400', get(400))
  el.style.setProperty('--brand-600', get(600))
  el.style.setProperty('--brand-700', get(700))
}

const STORAGE_PREFIX = 'theme:'

export function useTheme() {
  const activeColor = useState<ThemeKey>('app:theme-color', () => DEFAULT_THEME_KEY)

  function applyTheme(colorKey: string | ThemeKey) {
    const normalized = normalizeThemeKey(colorKey)
    if (import.meta.client) {
      applyColorVars(normalized)
    }
    activeColor.value = normalized
  }

  function saveProfileTheme(profileId: string, colorKey: string | ThemeKey) {
    if (import.meta.client) {
      localStorage.setItem(`${STORAGE_PREFIX}${profileId}`, normalizeThemeKey(colorKey))
    }
  }

  function loadProfileTheme(profileId: string, fallbackColor?: string | null) {
    if (!import.meta.client) return
    const hasFallback = typeof fallbackColor === 'string' && fallbackColor.length > 0
    const selected = hasFallback
      ? normalizeThemeKey(fallbackColor)
      : normalizeThemeKey(localStorage.getItem(`${STORAGE_PREFIX}${profileId}`))
    applyTheme(selected)
    saveProfileTheme(profileId, selected)
  }

  function setProfileTheme(colorKey: string | ThemeKey, profileId: string) {
    applyTheme(colorKey)
    saveProfileTheme(profileId, normalizeThemeKey(colorKey))
  }

  function initTheme(profileId?: string | null) {
    if (!import.meta.client) return
    const key = profileId ? `${STORAGE_PREFIX}${profileId}` : `${STORAGE_PREFIX}global`
    const saved = localStorage.getItem(key)
    applyTheme(saved || DEFAULT_THEME_KEY)
  }

  return { activeColor, THEMES, applyTheme, loadProfileTheme, saveProfileTheme, setProfileTheme, initTheme }
}
