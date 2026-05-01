import type { H3Event } from 'h3'
import { connectMongoose } from '../utils/mongoose'
import { requireActiveProfile } from '../utils/auth'
import { getCategoriasService } from '../services/categoria.service'
import { defineSuccess } from '../utils/response'

export async function getCategoriasController(event: H3Event) {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  
  const data = await getCategoriasService(profileId)

  // Envolvemos en defineSuccess para que el front lo procese siempre igual
  return defineSuccess(data, 'Categorías obtenidas correctamente')
}
