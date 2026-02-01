import mongoose, { Schema } from 'mongoose'

export type IngresoDocument = mongoose.Document & {
  description: string
  category: string
  amount: number
  date: Date
}

const IngresoSchema = new Schema<IngresoDocument>(
  {
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true }
  },
  {
    timestamps: true
  }
)

export const IngresoModel = mongoose.models.Ingreso || mongoose.model<IngresoDocument>('Ingreso', IngresoSchema, 'ingresos')
