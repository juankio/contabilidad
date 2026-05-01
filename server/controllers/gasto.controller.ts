import { readValidatedBody } from 'h3'
import type { H3Event } from 'h3'
import { connectMongoose } from '../utils/mongoose'
import { requireActiveProfile } from '../utils/auth'

import { GastoCreateSchema } from '../schemas/gasto.schema'
import { createGastoService } from '../services/gasto.service'

export async function createGastoController(event: H3Event) {
  // 1. Conexión y Auth
  await connectMongoose()
  const { profileId, user } = await requireActiveProfile(event)
  
  // 2. Zod
  const body = await readValidatedBody(event, GastoCreateSchema.parse)

  // 3. Lógica de Negocio
  const data = await createGastoService(profileId, user, body)

  // 4. Salida exitosa
  return data
}
