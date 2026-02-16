import { defineEventHandler, getQuery } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile, requireUser } from '../../utils/auth'
import mongoose from 'mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'

type MonthKey = {
  year: number
  month: number
}

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const query = getQuery(event)
  const requestedProfileId = typeof query.profileId === 'string' ? query.profileId.trim() : ''
  const scope = query.scope === 'all' ? 'all' : 'active'

  let profileObjectIds: mongoose.Types.ObjectId[] = []
  if (requestedProfileId) {
    const user = await requireUser(event)
    const exists = (user.profiles ?? []).some(profile => profile._id?.toString() === requestedProfileId)
    if (!exists) {
      profileObjectIds = []
    } else {
      profileObjectIds = [new mongoose.Types.ObjectId(requestedProfileId)]
    }
  } else if (scope === 'all') {
    const user = await requireUser(event)
    profileObjectIds = (user.profiles ?? [])
      .map(profile => profile._id)
      .filter((value): value is mongoose.Types.ObjectId => Boolean(value))
  } else {
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
        saldo: 0
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

  const [ingresosAgg, gastosAgg, categorias] = await Promise.all([
    IngresoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    GastoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    GastoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 6 },
      { $project: { _id: 0, category: '$_id', total: 1 } }
    ])
  ])

  const ingresos = ingresosAgg[0]?.total ?? 0
  const gastos = gastosAgg[0]?.total ?? 0
  const saldo = ingresos - gastos

  const months = getRecentMonths(6)
  const [ingresosSeries, gastosSeries] = await Promise.all([
    aggregateByMonth(IngresoModel, profileMatch),
    aggregateByMonth(GastoModel, profileMatch)
  ])

  const series = months.map((monthKey) => {
    const key = `${monthKey.year}-${monthKey.month}`
    return {
      month: formatMonthShort(monthKey.year, monthKey.month),
      ingresos: ingresosSeries[key] ?? 0,
      gastos: gastosSeries[key] ?? 0
    }
  })

  const monthLabel = formatMonthLong(now)

  return {
    resumen: {
      month: monthLabel,
      ingresos,
      gastos,
      saldo
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

async function aggregateByMonth(
  model: typeof GastoModel | typeof IngresoModel,
  profileId: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] }
) {
  const results = await model.aggregate<{ _id: MonthKey, total: number }>([
    { $match: { profileId } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' }
      }
    }
  ])

  const map: Record<string, number> = {}

  results.forEach((row) => {
    const key = `${row._id.year}-${row._id.month}`
    map[key] = row.total
  })

  return map
}

function formatMonthLong(date: Date) {
  const label = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}

function formatMonthShort(year: number, month: number) {
  const date = new Date(Date.UTC(year, month - 1, 1))
  const label = new Intl.DateTimeFormat('es-MX', {
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
