import { defineApiHandler } from '../../utils/handler'
import { getGastosController } from '../../controllers/gasto.get.controller'

export default defineApiHandler(getGastosController)
