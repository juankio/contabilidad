import { defineApiHandler } from '../../utils/handler'
import { getIngresosController } from '../../controllers/ingreso.get.controller'

export default defineApiHandler(getIngresosController)
