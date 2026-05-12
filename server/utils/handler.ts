import { defineEventHandler, setResponseStatus } from 'h3'
import type { EventHandler, EventHandlerRequest } from 'h3'
import { ZodError } from 'zod'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: any
}

export function defineApiHandler<T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    try {
      const result = await handler(event)
      return result
    } catch (error: any) {
      console.error('[API Error]:', error)

      let statusCode = 500
      let message = 'Internal Server Error'
      let errorDetails = undefined

      if (error instanceof ZodError) {
        statusCode = 400
        message = 'Validation Error'
        errorDetails = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      } else if (error.statusCode) {
        statusCode = error.statusCode
        message = error.statusMessage || error.message
      } else if (error.name === 'ValidationError') { // Mongoose validation error
        statusCode = 400
        message = 'Database Validation Error'
        errorDetails = error.message
      } else if (error instanceof Error) {
        message = error.message
      }

      setResponseStatus(event, statusCode)

      // H3 serializará esto y $fetch lo lanzará como un objeto de error en el front
      return {
        success: false,
        message: message,
        error: errorDetails || error.message || 'Error desconocido'
      } as unknown as D
    }
  })
}
