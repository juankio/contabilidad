import { defineEventHandler, getRequestURL, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event)
  if (pathname === '/_nuxt' || pathname === '/_nuxt/') {
    setResponseStatus(event, 204)
    return ''
  }
})
