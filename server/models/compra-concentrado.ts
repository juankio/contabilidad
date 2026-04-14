import mongoose, { Schema } from 'mongoose'

export type CompraConcentradoDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  formula: string
  kilos: number
  amount: number
  date: Date
  note: string
}

const CompraConcentradoSchema = new Schema<CompraConcentradoDocument>({
  profileId: { type: Schema.Types.ObjectId, required: true, index: true },
  formula: { type: String, required: true, trim: true },
  kilos: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  note: { type: String, default: '', trim: true }
}, { timestamps: true })

CompraConcentradoSchema.index({ profileId: 1, date: -1 })

type CompraConcentradoModelType = mongoose.Model<CompraConcentradoDocument>
export const CompraConcentradoModel = (mongoose.models.CompraConcentrado as CompraConcentradoModelType) || mongoose.model<CompraConcentradoDocument>('CompraConcentrado', CompraConcentradoSchema, 'compras_concentrado')
