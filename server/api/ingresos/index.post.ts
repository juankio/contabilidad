import { defineApiHandler } from '../../utils/handler'
import { createIngresoController } from '../../controllers/ingreso.controller'

export default defineApiHandler(createIngresoController)
