import { defineApiHandler } from '../../utils/handler'
import { defineEventHandler, createError } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { IngresoModel } from '../../models/ingreso'
import { toIsoDate } from '../../utils/date'

export default defineApiHandler(async (event) => {
  try {
    await connectMongoose()
    const { profileId } = await requireActiveProfile(event)
    const ingresos = await IngresoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(100).lean()

    const formattedIngresos = ingresos.map(ingreso => ({
      _id: ingreso._id.toString(),
      description: ingreso.description ?? '',
      category: ingreso.category ?? '',
      amount: Number(ingreso.amount ?? 0),
      date: toIsoDate(ingreso.date)
    }))

    return {
      success: true,
      data: formattedIngresos,
      message: 'Ingresos obtenidos correctamente'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error al obtener ingresos',
      data: { success: false, message: error.message }
    })
  }
})
