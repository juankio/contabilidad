import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PlanCompraModel } from '../../models/plan-compra'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const planes = await PlanCompraModel.find({ profileId })
    .sort({ fechaPlaneada: 1, _id: -1 })
    .limit(200)
    .lean()

  return planes.map(plan => ({
    _id: plan._id.toString(),
    nombre: plan.nombre,
    monto: Number(plan.monto),
    fechaPlaneada: plan.fechaPlaneada instanceof Date
      ? plan.fechaPlaneada.toISOString().slice(0, 7)
      : String(plan.fechaPlaneada).slice(0, 7),
    descripcion: plan.descripcion ?? '',
    completado: plan.completado ?? false,
    createdAt: plan.createdAt instanceof Date ? plan.createdAt.toISOString() : String(plan.createdAt)
  }))
})
