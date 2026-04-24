import { defineApiHandler } from '../../utils/handler'

import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import mongoose from 'mongoose'
import { getAvailableBalance } from '../../utils/balance'
import { getMonthlyStats } from '../../utils/stats-aggregations'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const profileObjectId = new mongoose.Types.ObjectId(profileId)

  const now = new Date()
  const start = getMonthStartUTC(now)
  const end = getNextMonthStartUTC(now)

  const [stats, saldoDisponible] = await Promise.all([
    getMonthlyStats(profileObjectId, start, end),
    getAvailableBalance(profileId)
  ])

  const ingresos = stats.ingresos
  const gastos = stats.gastos
  const saldo = ingresos - gastos

  const month = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(now)

  return {
    month: `${month.charAt(0).toUpperCase()}${month.slice(1)}`,
    ingresos,
    gastos,
    saldo,
    saldoDisponible
  }
})

function getMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function getNextMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
}
