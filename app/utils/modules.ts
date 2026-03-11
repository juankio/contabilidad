export type OptionalModuleKey
  = 'prestamos'
  | 'reportes'
  | 'catalogo-tienda'
  | 'catalogo-postres'
  | 'granja-cerdos'

export type ModuleKey = 'contabilidad' | OptionalModuleKey

export type ModuleNavItem = {
  label: string
  to: string
}

export type ModuleDefinition = {
  key: ModuleKey
  label: string
  description: string
  nav: ModuleNavItem[]
  alwaysActive?: boolean
}

export const MODULES: ModuleDefinition[] = [
  {
    key: 'contabilidad',
    label: 'Contabilidad',
    description: 'Resumen financiero y control de gastos.',
    nav: [
      { label: 'Inicio', to: '/' },
      { label: 'Gastos', to: '/gastos' }
    ],
    alwaysActive: true
  },
  {
    key: 'prestamos',
    label: 'Gestion de prestamos',
    description: 'Registra prestamos, abonos y saldos.',
    nav: [{ label: 'Prestamos', to: '/prestamos' }]
  },
  {
    key: 'reportes',
    label: 'Reportes',
    description: 'Analisis y reportes financieros.',
    nav: [{ label: 'Reportes', to: '/reportes' }]
  },
  {
    key: 'catalogo-tienda',
    label: 'Catalogo de tienda',
    description: 'Productos, precios y stock.',
    nav: [{ label: 'Tienda', to: '/catalogo-tienda' }]
  },
  {
    key: 'catalogo-postres',
    label: 'Catalogo de postres',
    description: 'Postres, ingredientes y precios.',
    nav: [{ label: 'Postres', to: '/catalogo-postres' }]
  },
  {
    key: 'granja-cerdos',
    label: 'Granja de cerdos',
    description: 'Control de animales, peso y ventas.',
    nav: [{ label: 'Granja', to: '/granja-cerdos' }]
  }
]

export const OPTIONAL_MODULES = MODULES.filter(module => !module.alwaysActive)

export const DEFAULT_OPTIONAL_MODULES: OptionalModuleKey[] = ['prestamos']

export const OPTIONAL_MODULE_KEYS = OPTIONAL_MODULES.map(module => module.key) as OptionalModuleKey[]
