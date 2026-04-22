import { defineApiHandler } from '../../utils/handler'
import { defineEventHandler } from 'h3'
import { clearAuthCookie } from '../../utils/auth'

export default defineApiHandler(async (event) => {
  clearAuthCookie(event)
  return { ok: true }
})
