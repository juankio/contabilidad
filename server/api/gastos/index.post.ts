import { defineApiHandler } from '../../utils/handler'
import { createGastoController } from '../../controllers/gasto.controller'

export default defineApiHandler(createGastoController)
