import { z } from 'zod'

export const GastoCreateSchema = z.object({
  description: z.string().trim().min(1, 'La descripción es requerida'),
  category: z.string().trim().min(1, 'La categoría es requerida').default('Sin categoria'),
  amount: z.preprocess(value => Number(value), z.number().positive('El monto debe ser mayor a 0')),
  date: z.string().optional()
})

export type GastoCreateDto = z.infer<typeof GastoCreateSchema>
