import { z } from 'zod'

export const IngresoCreateSchema = z.object({
  description: z.string().trim().min(1, 'La descripción es requerida'),
  category: z.string().trim().min(1, 'La categoría es requerida').default('Otros'),
  amount: z.preprocess(value => Number(value), z.number().positive('El monto debe ser mayor a 0')),
  date: z.string().optional()
})

export type IngresoCreateDto = z.infer<typeof IngresoCreateSchema>
