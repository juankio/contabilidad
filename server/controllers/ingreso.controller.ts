import { readValidatedBody } from 'h3'
import type { H3Event } from 'h3'
import { connectMongoose } from '../utils/mongoose'
import { requireActiveProfile } from '../utils/auth'
import { defineSuccess } from '../utils/response'
import { IngresoCreateSchema } from '../schemas/ingreso.schema'
import { createIngresoService } from '../services/ingreso.service'

export async function createIngresoController(event: H3Event) {
  // 1. Conexión y Auth
  await connectMongoose()
  const { profileId, user } = await requireActiveProfile(event)
  
  // 2. Validación de Zod (si falla, H3 tira un error 400 automáticamente)
  const body = await readValidatedBody(event, IngresoCreateSchema.parse)

  // 3. Lógica de negocio (Servicio)
  const data = await createIngresoService(profileId, user, body)

  // 4. Respuesta estándar
  return defineSuccess(data, 'Ingreso registrado correctamente')
}
