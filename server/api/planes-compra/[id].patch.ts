import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PlanCompraModel } from '../../models/plan-compra'

const schema = z.object({
  completado: z.boolean().optional(),
  nombre: z.string().trim().min(1).max(80).optional(),
  monto: z.preprocess(v => Number(v), z.number().positive()).optional(),
  fechaPlaneada: z.string().optional(),
  descripcion: z.string().trim().max(200).optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues.map(i => i.message).join(', ') })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const update: Record<string, unknown> = {}
  if (parsed.data.completado !== undefined) update.completado = parsed.data.completado
  if (parsed.data.nombre !== undefined) update.nombre = parsed.data.nombre
  if (parsed.data.monto !== undefined) update.monto = parsed.data.monto
  if (parsed.data.descripcion !== undefined) update.descripcion = parsed.data.descripcion
  if (parsed.data.fechaPlaneada !== undefined) {
    const fecha = new Date(parsed.data.fechaPlaneada + '-01')
    if (Number.isNaN(fecha.getTime())) {
      throw createError({ statusCode: 400, statusMessage: 'Fecha invalida' })
    }
    update.fechaPlaneada = fecha
  }

  const doc = await PlanCompraModel.findOneAndUpdate(
    { _id: id, profileId },
    { $set: update },
    { new: true }
  ).lean()

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Plan no encontrado' })
  }

  return {
    _id: doc._id.toString(),
    nombre: doc.nombre,
    monto: Number(doc.monto),
    fechaPlaneada: doc.fechaPlaneada instanceof Date
      ? doc.fechaPlaneada.toISOString().slice(0, 7)
      : String(doc.fechaPlaneada).slice(0, 7),
    descripcion: doc.descripcion ?? '',
    completado: doc.completado ?? false
  }
})
