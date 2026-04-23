import { defineApiHandler } from '../../utils/handler'
import { createError } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'
import { toIsoDate } from '../../utils/date'

export default defineApiHandler(async (event) => {
  try {
    await connectMongoose()
    const { profileId } = await requireActiveProfile(event)
    const gastos = await GastoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(100).lean()

    const formattedGastos = gastos.map(gasto => ({
      _id: gasto._id.toString(),
      description: gasto.description ?? '',
      category: gasto.category ?? '',
      amount: Number(gasto.amount ?? 0),
      date: toIsoDate(gasto.date)
    }))

    return {
      success: true,
      data: formattedGastos,
      message: 'Gastos obtenidos correctamente'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error al obtener gastos',
      data: { success: false, message: error.message }
    })
  }
})
