import mongoose, { Schema } from 'mongoose'

export type GastoDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  description: string
  category: string
  amount: number
  date: Date
  receipt?: {
    url: string
    publicId: string
  }
}

const GastoSchema = new Schema<GastoDocument>(
  {
    profileId: { type: Schema.Types.ObjectId, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    receipt: {
      url: { type: String, trim: true },
      publicId: { type: String, trim: true }
    }
  },
  {
    timestamps: true
  }
)

type GastoModelType = mongoose.Model<GastoDocument>

export const GastoModel = (mongoose.models.Gasto as GastoModelType)
  || mongoose.model<GastoDocument>('Gasto', GastoSchema, 'gastos')
