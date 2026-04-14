import mongoose, { Schema } from 'mongoose'

export type TrabajadorDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  nombre: string
  cargo: string
  salario: number
  fechaIngreso: Date
  activo: boolean
}

const TrabajadorSchema = new Schema<TrabajadorDocument>({
  profileId: { type: Schema.Types.ObjectId, required: true, index: true },
  nombre: { type: String, required: true, trim: true },
  cargo: { type: String, required: true, trim: true },
  salario: { type: Number, required: true, min: 0 },
  fechaIngreso: { type: Date, required: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true })

type TrabajadorModelType = mongoose.Model<TrabajadorDocument>
export const TrabajadorModel = (mongoose.models.Trabajador as TrabajadorModelType) || mongoose.model<TrabajadorDocument>('Trabajador', TrabajadorSchema, 'trabajadores')
