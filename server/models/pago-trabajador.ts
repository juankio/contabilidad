import mongoose, { Schema } from 'mongoose'

export type PagoTrabajadorDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  trabajadorId: mongoose.Types.ObjectId
  amount: number
  date: Date
  tipo: 'quincena' | 'adelanto' | 'liquidacion'
  note: string
}

const PagoTrabajadorSchema = new Schema<PagoTrabajadorDocument>({
  profileId: { type: Schema.Types.ObjectId, required: true, index: true },
  trabajadorId: { type: Schema.Types.ObjectId, required: true, ref: 'Trabajador' },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  tipo: { type: String, enum: ['quincena', 'adelanto', 'liquidacion'], required: true },
  note: { type: String, default: '', trim: true }
}, { timestamps: true })

PagoTrabajadorSchema.index({ profileId: 1, date: -1 })

type PagoTrabajadorModelType = mongoose.Model<PagoTrabajadorDocument>
export const PagoTrabajadorModel = (mongoose.models.PagoTrabajador as PagoTrabajadorModelType) || mongoose.model<PagoTrabajadorDocument>('PagoTrabajador', PagoTrabajadorSchema, 'pagos_trabajadores')
