const FALLBACK_ISO_DATE = '1970-01-01T00:00:00.000Z'

export function toIsoDate(value: unknown) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? FALLBACK_ISO_DATE : value.toISOString()
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? FALLBACK_ISO_DATE : parsed.toISOString()
  }

  return FALLBACK_ISO_DATE
}

export function compareByDateDescWithId(
  a: { date: string, _id: string },
  b: { date: string, _id: string }
) {
  const byDate = new Date(b.date).getTime() - new Date(a.date).getTime()
  if (byDate !== 0) {
    return byDate
  }
  return b._id.localeCompare(a._id)
}
