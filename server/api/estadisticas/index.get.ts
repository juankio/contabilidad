import { defineApiHandler } from '../../utils/handler'
import { getQuery } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile, requireUser } from '../../utils/auth'
import mongoose from 'mongoose'

import { getAvailableBalance } from '../../utils/balance'
import { getMonthlyStats, getCategoriesWithOtherModules, getSeriesWithOtherModules } from '../../utils/stats-aggregations'

type MonthKey = {
  year: number
  month: number
}

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const query = getQuery(event)
  const requestedProfileId = typeof query.profileId === 'string' ? query.profileId.trim() : ''
  const scope = query.scope === 'all' ? 'all' : 'active'

  let profileObjectIds: mongoose.Types.ObjectId[] = []
  if (requestedProfileId && requestedProfileId !== 'all' && requestedProfileId !== 'active') {
    const user = await requireUser(event)
    const exists = (user.profiles ?? []).some(profile => profile._id?.toString() === requestedProfileId)
    if (!exists) {
      profileObjectIds = []
    } else {
      profileObjectIds = [new mongoose.Types.ObjectId(requestedProfileId)]
    }
  } else if (requestedProfileId === 'all' || scope === 'all') {
    // Si realmente quiere ver "Todos" (consolidados globales)
    const user = await requireUser(event)
    profileObjectIds = (user.profiles ?? [])
      .map(profile => profile._id)
      .filter((value): value is mongoose.Types.ObjectId => Boolean(value))
  } else if (requestedProfileId === 'active') {
    // Solo el perfil que está activamente seleccionado en la sesión
    const { profileId } = await requireActiveProfile(event)
    profileObjectIds = [new mongoose.Types.ObjectId(profileId)]
  } else {
    // Fallback por defecto: el perfil activo
    const { profileId } = await requireActiveProfile(event)
    profileObjectIds = [new mongoose.Types.ObjectId(profileId)]
  }

  if (profileObjectIds.length === 0) {
    const months = getRecentMonths(6)
    return {
      resumen: {
        month: formatMonthLong(new Date()),
        ingresos: 0,
        gastos: 0,
        saldo: 0,
        saldoDisponible: 0
      },
      categorias: [],
      series: months.map(monthKey => ({
        month: formatMonthShort(monthKey.year, monthKey.month),
        ingresos: 0,
        gastos: 0
      }))
    }
  }

  const profileMatch: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] } = profileObjectIds.length === 1
    ? profileObjectIds[0]!
    : { $in: profileObjectIds }

  const now = new Date()
  const start = getMonthStartUTC(now)
  const end = getNextMonthStartUTC(now)

  const [monthStats, categorias, saldoDisponible] = await Promise.all([
    getMonthlyStats(profileMatch, start, end),
    getCategoriesWithOtherModules(profileMatch, start, end),
    getAvailableBalance(profileMatch)
  ])

  const ingresos = monthStats.ingresos
  const gastos = monthStats.gastos
  const saldo = ingresos - gastos

  const months = getRecentMonths(6)
  const seriesMap = await getSeriesWithOtherModules(profileMatch, months)

  const series = months.map((monthKey) => {
    const key = `${monthKey.year}-${monthKey.month}`
    return {
      month: formatMonthShort(monthKey.year, monthKey.month),
      ingresos: seriesMap[key]?.ingresos ?? 0,
      gastos: seriesMap[key]?.gastos ?? 0
    }
  })

  const monthLabel = formatMonthLong(now)

  return {
    resumen: {
      month: monthLabel,
      ingresos,
      gastos,
      saldo,
      saldoDisponible
    },
    categorias: categorias.map(categoria => ({
      category: categoria.category || 'Sin categoria',
      total: Number(categoria.total ?? 0)
    })),
    series
  }
})

function getRecentMonths(count: number): MonthKey[] {
  const now = new Date()
  const months: MonthKey[] = []

  for (let i = 0; i < count; i += 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    months.push({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1
    })
  }

  return months.reverse()
}

function formatMonthLong(date: Date) {
  const label = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}

function formatMonthShort(year: number, month: number) {
  const date = new Date(Date.UTC(year, month - 1, 1))
  const label = new Intl.DateTimeFormat('es-CO', {
    month: 'short',
    timeZone: 'UTC'
  }).format(date)
  return label.replace('.', '')
}

function getMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function getNextMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
}
