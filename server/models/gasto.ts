import mongoose, { Schema } from 'mongoose'

export type GastoDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  description: string
  category: string
  amount: number
  date: Date
}

const GastoSchema = new Schema<GastoDocument>(
  {
    profileId: { type: Schema.Types.ObjectId, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true }
  },
  {
    timestamps: true
  }
)

export const GastoModel = mongoose.models.Gasto || mongoose.model<GastoDocument>('Gasto', GastoSchema, 'gastos')
