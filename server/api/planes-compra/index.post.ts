import { defineApiHandler } from '../../utils/handler'
import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PlanCompraModel } from '../../models/plan-compra'

const schema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es requerido').max(80),
  monto: z.preprocess(v => Number(v), z.number().positive('El monto debe ser positivo')),
  fechaPlaneada: z.string().min(1, 'La fecha es requerida'),
  descripcion: z.string().trim().max(200).optional()
})

export default defineApiHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues.map(i => i.message).join(', ')
    })
  }

  const fechaPlaneada = new Date(parsed.data.fechaPlaneada + '-01')
  if (Number.isNaN(fechaPlaneada.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Fecha invalida' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const doc = await PlanCompraModel.create({
    profileId,
    nombre: parsed.data.nombre,
    monto: parsed.data.monto,
    fechaPlaneada,
    descripcion: parsed.data.descripcion?.trim() ?? '',
    completado: false
  })

  return {
    _id: doc._id.toString(),
    nombre: doc.nombre,
    monto: Number(doc.monto),
    fechaPlaneada: doc.fechaPlaneada.toISOString().slice(0, 7),
    descripcion: doc.descripcion,
    completado: doc.completado,
    createdAt: doc.createdAt.toISOString()
  }
})
