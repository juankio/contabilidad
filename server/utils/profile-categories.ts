export const DEFAULT_EXPENSE_CATEGORIES = [
  'Alimentacion',
  'Servicios',
  'Transporte',
  'Salud',
  'Otros'
]

export const DEFAULT_INCOME_CATEGORIES = [
  'Ventas',
  'Servicios',
  'Salario',
  'Otros'
]

const MAX_CATEGORY_LENGTH = 40
export const MAX_CATEGORIES = 100

export function normalizeDefaultVisibility(
  hiddenCategories: unknown,
  defaults: string[]
) {
  if (!Array.isArray(hiddenCategories)) {
    return []
  }

  const defaultsByKey = new Map(
    defaults.map(category => [category.toLocaleLowerCase(), category])
  )

  const hidden: string[] = []
  const seen = new Set<string>()

  for (const value of hiddenCategories) {
    if (typeof value !== 'string') {
      continue
    }

    const key = value.trim().toLocaleLowerCase()
    if (!key || seen.has(key) || !defaultsByKey.has(key)) {
      continue
    }

    seen.add(key)
    hidden.push(defaultsByKey.get(key) as string)
  }

  return hidden
}

export function normalizeCategories(
  categories: unknown,
  fallback: string[]
) {
  const result: string[] = []
  const seen = new Set<string>()

  // Keep default categories for every profile and append custom ones.
  for (const value of fallback) {
    const cleaned = value.trim().slice(0, MAX_CATEGORY_LENGTH)
    if (!cleaned) {
      continue
    }

    const key = cleaned.toLocaleLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(cleaned)
  }

  if (!Array.isArray(categories)) {
    return result
  }

  for (const value of categories) {
    if (typeof value !== 'string') {
      continue
    }

    const cleaned = value.trim().slice(0, MAX_CATEGORY_LENGTH)
    if (!cleaned) {
      continue
    }

    const key = cleaned.toLocaleLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(cleaned)

    if (result.length >= MAX_CATEGORIES) {
      break
    }
  }

  return result
}
