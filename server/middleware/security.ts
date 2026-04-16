export default defineEventHandler((event) => {
  // Basic security headers
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'X-Frame-Options', 'DENY')
  setResponseHeader(event, 'X-XSS-Protection', '1; mode=block')
  setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setResponseHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Prevent caching sensitive API data
  const url = event.node.req.url
  if (url?.startsWith('/api/')) {
    setResponseHeader(event, 'Cache-Control', 'no-store, max-age=0, must-revalidate')
    setResponseHeader(event, 'Pragma', 'no-cache')
  }
})
