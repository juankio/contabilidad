import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { TrabajadorModel } from '../../models/trabajador'

const schema = z.object({
  nombre: z.string().trim().min(1),
  cargo: z.string().trim().min(1),
  salario: z.preprocess(val => Number(val), z.number().positive())
})

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const doc = await TrabajadorModel.findOneAndUpdate(
    { _id: id, profileId },
    {
      nombre: parsed.data.nombre,
      cargo: parsed.data.cargo,
      salario: parsed.data.salario
    },
    { new: true }
  )

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Trabajador no encontrado' })
  }

  return doc
})
