import mongoose, { Schema } from 'mongoose'

export type PlanCompraDocument = mongoose.Document & {
  profileId: string
  nombre: string
  monto: number
  fechaPlaneada: Date
  descripcion: string
  completado: boolean
  createdAt: Date
}

const PlanCompraSchema = new Schema<PlanCompraDocument>(
  {
    profileId: { type: String, required: true, index: true },
    nombre: { type: String, required: true, trim: true },
    monto: { type: Number, required: true },
    fechaPlaneada: { type: Date, required: true },
    descripcion: { type: String, default: '', trim: true },
    completado: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { transform: (_, ret) => {
      const serialized = ret as any & { __v?: unknown }
      delete serialized.__v
      return serialized
    } }
  }
)

type PlanCompraModelType = mongoose.Model<PlanCompraDocument>

export const PlanCompraModel = (mongoose.models.PlanCompra as PlanCompraModelType)
  || mongoose.model<PlanCompraDocument>('PlanCompra', PlanCompraSchema, 'planes_compra')
