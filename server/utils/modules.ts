export const OPTIONAL_MODULES = [
  'prestamos',
  'reportes',
  'catalogo-tienda',
  'catalogo-postres',
  'granja-cerdos',
  'planeador'
] as const

export type OptionalModuleKey = typeof OPTIONAL_MODULES[number]

export const DEFAULT_OPTIONAL_MODULES: OptionalModuleKey[] = ['prestamos']

export function normalizeModules(value: string[] | undefined | null): OptionalModuleKey[] {
  if (!value) return []
  const allowed = new Set(OPTIONAL_MODULES)
  const normalized: OptionalModuleKey[] = []
  for (const item of value) {
    if (allowed.has(item as OptionalModuleKey) && !normalized.includes(item as OptionalModuleKey)) {
      normalized.push(item as OptionalModuleKey)
    }
  }
  return normalized
}
