import { defineEventHandler, getRequestURL, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  if (getRequestURL(event).pathname !== '/_nuxt/') {
    return
  }

  // Some clients request the assets directory root during dev.
  // Reply with 204 to avoid noisy 404 logs while keeping /_nuxt/* assets untouched.
  setResponseStatus(event, 204)
  return ''
})
