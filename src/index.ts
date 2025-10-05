import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { requestId } from 'hono/request-id'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { globalErrorHandler } from "../utils/errorHandler"
import { logger } from "../middleware/logger"
import { rateLimiter } from "../middleware/rateLimiter"
import { securityHeaders, productionLogger, responseCache } from "../middleware/production"
import { apiKeyAuth } from "../middleware/auth"
import { adminAuth } from "../middleware/adminAuth"
import usersRoute from "../routes/users"
import adminRoute from "../routes/admin"

// Define environment types for Cloudflare Workers
type Bindings = {
  API_KEYS: string
  ADMIN_SECRET: string
  ENVIRONMENT?: string
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()

// Start time for uptime calculation
const startTime = Date.now()

// OpenAPI info with security schemes
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'CozySnippet API',
    description: 'A production-ready API built with Hono and OpenAPI documentation',
    contact: {
      name: 'API Support',
      email: 'support@cozysnippet.com'
    }
  },
  servers: [
    {
      url: 'https://api.cozysnippet.com',
      description: 'Production server (Custom Domain)'
    },
    {
      url: 'https://cozysnippet-api-prod.raksmeykoung.workers.dev',
      description: 'Production server (Workers Domain)'
    },
    {
      url: 'http://localhost:8787',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Users', description: 'User management operations' },
    { name: 'Admin', description: 'API key management (Admin only)' }
  ]
})

// Register security schemes after doc setup
app.openAPIRegistry.registerComponent('securitySchemes', 'ApiKeyAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'X-API-Key',
  description: 'API key for authentication. Use: cz_dev_key_for_local_development_only'
})

app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  description: 'Bearer token authentication'
})

app.openAPIRegistry.registerComponent('securitySchemes', 'AdminAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'X-Admin-Secret',
  description: 'Admin secret for key management. Use: admin_dev_secret_change_in_production'
})

// Production-ready Swagger UI
app.get('/ui', swaggerUI({
  url: '/doc'
}))

// Global error handler
app.onError(globalErrorHandler)

// Core middleware
app.use('*', requestId())

// Environment-aware CORS
app.use('*', cors({
    origin: ['*'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Admin-Secret'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: false
}))

// Rate limiting
app.use('*', rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again later.'
}))

// Logging
app.use('*', logger)

// Health check (public route) - MUST come BEFORE authentication middleware
const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  summary: 'API Health Check',
  description: 'Check the health status of the API service',
  responses: {
    200: {
      description: 'API is healthy and operational',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string().openapi({ example: 'healthy' }),
            timestamp: z.string().openapi({ example: '2025-10-04T12:00:00.000Z' }),
            version: z.string().openapi({ example: '1.0.0' }),
            uptime: z.number().openapi({ example: 123.45 })
          })
        }
      }
    }
  }
})

app.openapi(healthRoute, (c) => {
    const uptime = (Date.now() - startTime) / 1000
    return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: uptime,
    })
})

// Admin routes (protected with admin secret) - MUST come BEFORE API auth middleware
app.use('/admin/*', adminAuth())
app.route('/admin', adminRoute)

// Authentication middleware for API routes only - MUST come AFTER public routes
app.use('/api/*', apiKeyAuth())

// Protected API routes
app.route('/api/v1/users', usersRoute)

// Catch-all route for 404s
app.notFound((c) => {
    return c.json({
        success: false,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: 'The requested route was not found',
        },
    }, 404)
})

export default {
    port: 8787,
    fetch: app.fetch,
}
