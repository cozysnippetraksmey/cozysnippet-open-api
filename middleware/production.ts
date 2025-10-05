import { Context, Next } from 'hono'

/**
 * Security Headers Middleware
 * Adds essential security headers for production
 */
export const securityHeaders = () => {
  return async (c: Context, next: Next) => {
    await next()

    // Security headers for production
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    // Remove server information
    c.header('Server', 'CozySnippet-API')
  }
}

/**
 * Enhanced Logging Middleware for Production
 */
export const productionLogger = () => {
  return async (c: Context, next: Next) => {
    const start = Date.now()
    const requestId = c.get('requestId') || 'unknown'

    await next()

    const duration = Date.now() - start
    const logData = {
      timestamp: new Date().toISOString(),
      requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: `${duration}ms`,
      userAgent: c.req.header('User-Agent'),
      ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
      country: c.req.header('CF-IPCountry'),
      ray: c.req.header('CF-Ray'),
      environment: c.env?.ENVIRONMENT || 'development'
    }

    // Log errors with more detail
    if (c.res.status >= 400) {
      console.error('API Error:', JSON.stringify(logData))
    } else {
      console.log('API Request:', JSON.stringify(logData))
    }
  }
}

/**
 * Response Caching Middleware
 */
export const responseCache = (maxAge: number = 300) => {
  return async (c: Context, next: Next) => {
    await next()

    // Only cache successful GET requests
    if (c.req.method === 'GET' && c.res.status === 200) {
      c.header('Cache-Control', `public, max-age=${maxAge}`)
    } else {
      c.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    }
  }
}
