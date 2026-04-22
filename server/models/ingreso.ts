import mongoose, { Schema } from 'mongoose'

export type IngresoDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  description: string
  category: string
  amount: number
  date: Date
}

const IngresoSchema = new Schema<IngresoDocument>(
  {
    profileId: { type: Schema.Types.ObjectId, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete (ret as any).__v
        return ret
      }
    }
  }
)

type IngresoModelType = mongoose.Model<IngresoDocument>

export const IngresoModel = (mongoose.models.Ingreso as IngresoModelType)
  || mongoose.model<IngresoDocument>('Ingreso', IngresoSchema, 'ingresos')
