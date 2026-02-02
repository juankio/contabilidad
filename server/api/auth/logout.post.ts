import { defineEventHandler } from 'h3'
import { clearAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  clearAuthCookie(event)
  return { ok: true }
})
