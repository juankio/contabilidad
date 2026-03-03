import mongoose, { Schema } from 'mongoose'

type PrestamoAbono = {
  _id: mongoose.Types.ObjectId
  amount: number
  date: Date
  note: string
}

export type PrestamoDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  borrower: string
  description: string
  amount: number
  paidAmount: number
  date: Date
  paymentPlan: 'single' | 'installments'
  installmentsCount: number | null
  collectionDate: Date | null
  note: string
  abonos: PrestamoAbono[]
}

const PrestamoAbonoSchema = new Schema<PrestamoAbono>(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    note: { type: String, default: '', trim: true }
  },
  {
    _id: true
  }
)

const PrestamoSchema = new Schema<PrestamoDocument>(
  {
    profileId: { type: Schema.Types.ObjectId, required: true, index: true },
    borrower: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, min: 0, default: 0 },
    date: { type: Date, required: true },
    paymentPlan: {
      type: String,
      enum: ['single', 'installments'],
      required: true,
      default: 'single'
    },
    installmentsCount: { type: Number, min: 2, default: null },
    collectionDate: { type: Date, default: null },
    note: { type: String, default: '', trim: true },
    abonos: { type: [PrestamoAbonoSchema], default: [] }
  },
  {
    timestamps: true
  }
)

PrestamoSchema.index({ profileId: 1, date: -1, _id: -1 })

type PrestamoModelType = mongoose.Model<PrestamoDocument>

export const PrestamoModel = (mongoose.models.Prestamo as PrestamoModelType)
  || mongoose.model<PrestamoDocument>('Prestamo', PrestamoSchema, 'prestamos')
