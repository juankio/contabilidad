import { defineApiHandler } from '../../utils/handler'
import { getCategoriasController } from '../../controllers/categoria.controller'

export default defineApiHandler(getCategoriasController)
