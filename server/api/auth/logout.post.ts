import { defineApiHandler } from '../../utils/handler'

import { clearAuthCookie } from '../../utils/auth'

export default defineApiHandler(async (event) => {
  clearAuthCookie(event)
  return { ok: true }
})
