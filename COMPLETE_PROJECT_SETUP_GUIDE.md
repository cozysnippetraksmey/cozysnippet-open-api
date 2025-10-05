# Complete Hono + Cloudflare Workers Project Setup Guide

## 🎯 Overview

This comprehensive guide covers setting up a production-ready API project using Hono framework with Cloudflare Workers, from initial setup to production deployment. This is based on the actual `cozysnippet-open-api` project implementation.

## 📋 Table of Contents

1. [Prerequisites & Tools](#prerequisites--tools)
2. [Project Initialization](#project-initialization)
3. [Core Dependencies Setup](#core-dependencies-setup)
4. [Project Structure](#project-structure)
5. [Configuration Files](#configuration-files)
6. [Core Implementation](#core-implementation)
7. [Authentication & Security](#authentication--security)
8. [OpenAPI Documentation](#openapi-documentation)
9. [Environment Management](#environment-management)
10. [Testing Setup](#testing-setup)
11. [Production Deployment](#production-deployment)
12. [Custom Domain Setup](#custom-domain-setup)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)

## 🛠️ Prerequisites & Tools

### Required Software
```bash
# Node.js (v18+ recommended)
node --version  # Should be v18.0.0 or higher

# npm (comes with Node.js)
npm --version   # Should be 8.0.0 or higher

# Git (for version control)
git --version
```

### Required Accounts
- **Cloudflare Account** (free tier works)
- **GitHub Account** (for code repository)
- **Optional:** Custom domain (if you want professional URLs)

### Development Environment
- **Code Editor:** VS Code (recommended)
- **Terminal:** Any terminal (bash, zsh, PowerShell)
- **Browser:** Chrome/Firefox for testing

## 🚀 Project Initialization

### Step 1: Create Project Directory
```bash
# Create project directory
mkdir my-hono-api
cd my-hono-api

# Initialize Git repository
git init

# Initialize npm project
npm init -y
```

### Step 2: Update package.json
Replace the generated `package.json` with the following production-ready configuration:

```json
{
  "name": "my-hono-api",
  "version": "1.0.0",
  "description": "A production-ready API built with Hono and Cloudflare Workers",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy --minify",
    "deploy:staging": "wrangler deploy --env staging --minify",
    "deploy:production": "wrangler deploy --env production --minify",
    "build": "tsc",
    "test": "vitest",
    "generate-keys": "node scripts/generate-keys.js",
    "generate-admin-secret": "node scripts/generate-admin-secret.js",
    "logs": "wrangler tail",
    "logs:production": "wrangler tail --env production"
  },
  "keywords": ["hono", "api", "typescript", "cloudflare", "workers"],
  "author": "Your Name",
  "license": "MIT"
}
```

## 📦 Core Dependencies Setup

### Step 3: Install Core Dependencies
```bash
# Core Hono and OpenAPI dependencies
npm install hono @hono/zod-openapi @hono/swagger-ui zod

# Development dependencies
npm install -D typescript @types/node wrangler vitest

# Optional: Linting and code quality
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Dependencies Explanation
- **`hono`**: The main web framework
- **`@hono/zod-openapi`**: OpenAPI integration with Zod validation
- **`@hono/swagger-ui`**: Swagger UI for API documentation
- **`zod`**: Type-safe schema validation
- **`typescript`**: TypeScript compiler
- **`wrangler`**: Cloudflare Workers CLI tool
- **`vitest`**: Fast testing framework

## 📁 Project Structure

### Step 4: Create Project Structure
```bash
# Create directory structure
mkdir -p src controllers middleware routes schemas services types utils tests scripts config

# Create initial files
touch src/index.ts
touch wrangler.jsonc
touch tsconfig.json
touch .gitignore
touch .dev.vars
touch .env.example
touch README.md
```

### Final Project Structure
```
my-hono-api/
├── package.json
├── tsconfig.json
├── wrangler.jsonc
├── .gitignore
├── .dev.vars
├── .env.example
├── README.md
├── vitest.config.ts
├── src/
│   └── index.ts
├── controllers/
│   └── usersController.ts
├── middleware/
│   ├── auth.ts
│   ├── logger.ts
│   └── rateLimiter.ts
├── routes/
│   ├── users.ts
│   └── admin.ts
├── schemas/
│   └── openapi.ts
├── services/
│   └── userService.ts
├── types/
│   └── user.ts
├── utils/
│   ├── errorHandler.ts
│   ├── response.ts
│   └── validators.ts
├── tests/
│   └── users.test.ts
└── scripts/
    ├── generate-keys.js
    └── generate-admin-secret.js
```

## ⚙️ Configuration Files

### Step 5: TypeScript Configuration
Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 6: Wrangler Configuration
Create `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-hono-api",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-04",
  "vars": {
    "ENVIRONMENT": "development",
    "API_KEYS": "your_dev_api_key_here",
    "ADMIN_SECRET": "your_dev_admin_secret_here"
  },
  "env": {
    "production": {
      "name": "my-hono-api-prod",
      "vars": {
        "ENVIRONMENT": "production",
        "API_KEYS": "your_production_api_keys_here",
        "ADMIN_SECRET": "your_production_admin_secret_here"
      }
    },
    "staging": {
      "name": "my-hono-api-staging",
      "vars": {
        "ENVIRONMENT": "staging",
        "API_KEYS": "your_staging_api_keys_here",
        "ADMIN_SECRET": "your_staging_admin_secret_here"
      }
    }
  }
}
```

### Step 7: Git Configuration
Create `.gitignore`:

```bash
# Dependencies
node_modules/
.wrangler/

# Environment variables
.dev.vars
.env
.env.*
!.env.example

# Build outputs
dist/
*.tsbuildinfo

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### Step 8: Environment Variables Setup
Create `.env.example`:

```bash
# Environment Variables Template
# Copy this to .dev.vars for local development

# API Keys (comma-separated list)
API_KEYS=your_dev_api_key_1,your_dev_api_key_2

# Admin Secret
ADMIN_SECRET=your_dev_admin_secret

# Environment
ENVIRONMENT=development
```

Create `.dev.vars`:

```bash
# Local development environment variables
API_KEYS=dev_key_local_123,dev_key_local_456
ADMIN_SECRET=admin_dev_secret_very_secure
ENVIRONMENT=development
```

## 🎯 Core Implementation

### Step 9: Main Application File
Create `src/index.ts`:

```typescript
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { requestId } from 'hono/request-id'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'

// Define environment types for Cloudflare Workers
type Bindings = {
  API_KEYS: string
  ADMIN_SECRET: string
  ENVIRONMENT?: string
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()

// Start time for uptime calculation
const startTime = Date.now()

// OpenAPI documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My Hono API',
    description: 'A production-ready API built with Hono and OpenAPI documentation'
  },
  servers: [
    {
      url: 'http://localhost:8787',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoints' }
  ]
})

// Swagger UI
app.get('/ui', swaggerUI({
  url: '/doc'
}))

// Core middleware
app.use('*', requestId())
app.use('*', cors({
  origin: ['*'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// Health check route
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
            status: z.string(),
            timestamp: z.string(),
            version: z.string(),
            uptime: z.number()
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
    uptime: uptime
  })
})

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested route was not found'
    }
  }, 404)
})

export default {
  port: 8787,
  fetch: app.fetch
}
```

## 🔐 Authentication & Security

### Step 10: Create Authentication Middleware
Create `middleware/auth.ts`:

```typescript
import { Context, Next } from 'hono'

interface Env {
  API_KEYS?: string
}

export const apiKeyAuth = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const apiKey = c.req.header('X-API-Key') || 
                   c.req.header('Authorization')?.replace('Bearer ', '')

    if (!apiKey) {
      return c.json({
        success: false,
        error: {
          code: 'MISSING_API_KEY',
          message: 'API key is required. Provide it in X-API-Key header or Authorization header as Bearer token.'
        },
        timestamp: new Date().toISOString()
      }, 401)
    }

    const validApiKeys = c.env?.API_KEYS?.split(',').map(key => key.trim()) || []

    if (validApiKeys.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_CONFIG_ERROR',
          message: 'Authentication not properly configured'
        },
        timestamp: new Date().toISOString()
      }, 500)
    }

    if (!validApiKeys.includes(apiKey)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key provided'
        },
        timestamp: new Date().toISOString()
      }, 401)
    }

    await next()
  }
}
```

### Step 11: Create Rate Limiting Middleware
Create `middleware/rateLimiter.ts`:

```typescript
import type { Context, Next } from 'hono'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  message?: string
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export const rateLimiter = (options: RateLimitOptions) => {
  return async (c: Context, next: Next) => {
    const clientIp = c.req.header('cf-connecting-ip') ||
                     c.req.header('x-forwarded-for') ||
                     'unknown'

    const now = Date.now()
    const windowStart = now - options.windowMs

    // Clean up old entries
    for (const [ip, data] of requestCounts.entries()) {
      if (data.resetTime < now) {
        requestCounts.delete(ip)
      }
    }

    const clientData = requestCounts.get(clientIp)

    if (!clientData || clientData.resetTime < now) {
      requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + options.windowMs
      })
    } else {
      clientData.count++

      if (clientData.count > options.maxRequests) {
        return c.json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: options.message || 'Too many requests'
          }
        }, 429)
      }
    }

    // Add rate limit headers
    const remaining = Math.max(0, options.maxRequests - (clientData?.count || 1))
    const resetTime = new Date(clientData?.resetTime || now + options.windowMs)

    c.header('X-RateLimit-Limit', options.maxRequests.toString())
    c.header('X-RateLimit-Remaining', remaining.toString())
    c.header('X-RateLimit-Reset', resetTime.toISOString())

    await next()
  }
}
```

## 🗂️ Schemas and Types

### Step 12: Create OpenAPI Schemas
Create `schemas/openapi.ts`:

```typescript
import { z } from 'zod'

// User schema
export const UserSchema = z.object({
  id: z.string().uuid().openapi({
    description: 'Unique user identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  }),
  name: z.string().min(1).max(100).openapi({
    description: 'User full name',
    example: 'John Doe'
  }),
  email: z.string().email().openapi({
    description: 'User email address',
    example: 'john.doe@example.com'
  }),
  createdAt: z.string().datetime().openapi({
    description: 'User creation timestamp',
    example: '2025-10-04T12:00:00.000Z'
  }),
  updatedAt: z.string().datetime().openapi({
    description: 'User last update timestamp',
    example: '2025-10-04T12:00:00.000Z'
  })
})

// Create user request schema
export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100).openapi({
    description: 'User full name',
    example: 'John Doe'
  }),
  email: z.string().email().openapi({
    description: 'User email address',
    example: 'john.doe@example.com'
  })
})

// Success response schema
export const SuccessResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'Operation completed successfully' }),
  data: z.any().optional()
})

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  error: z.object({
    code: z.string().openapi({ example: 'VALIDATION_ERROR' }),
    message: z.string().openapi({ example: 'Invalid input provided' }),
    details: z.any().optional()
  }),
  timestamp: z.string().openapi({ example: '2025-10-04T12:00:00.000Z' })
})
```

## 🛠️ Utility Functions

### Step 13: Create Error Handler
Create `utils/errorHandler.ts`:

```typescript
import type { Context } from 'hono'

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export const globalErrorHandler = (err: unknown, c: Context) => {
  console.error('Error:', err)

  if (err instanceof ValidationError) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: { field: err.field }
      },
      timestamp: new Date().toISOString()
    }, 400)
  }

  if (err instanceof NotFoundError) {
    return c.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: err.message
      },
      timestamp: new Date().toISOString()
    }, 404)
  }

  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    },
    timestamp: new Date().toISOString()
  }, 500)
}
```

### Step 14: Create Response Utilities
Create `utils/response.ts`:

```typescript
import type { Context } from 'hono'

export const successResponse = (
  c: Context,
  message: string,
  data?: any,
  status: number = 200
) => {
  return c.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }, status)
}

export const errorResponse = (
  c: Context,
  code: string,
  message: string,
  details?: any,
  status: number = 400
) => {
  return c.json({
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString()
  }, status)
}
```

## 🧪 Testing Setup

### Step 15: Create Test Configuration
Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare',
    environmentOptions: {
      bindings: {
        API_KEYS: 'test_key_1,test_key_2',
        ADMIN_SECRET: 'test_admin_secret',
        ENVIRONMENT: 'test'
      }
    }
  }
})
```

### Step 16: Create Sample Tests
Create `tests/api.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('API Health Check', () => {
  it('should return healthy status', async () => {
    // Mock test - replace with actual implementation
    const response = { status: 'healthy' }
    expect(response.status).toBe('healthy')
  })
})
```

## 🔧 Utility Scripts

### Step 17: Create Key Generation Scripts
Create `scripts/generate-keys.js`:

```javascript
import crypto from 'crypto'

function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'api_'

  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const key = generateApiKey()
console.log('Generated API Key:', key)
console.log('\nSetup Instructions:')
console.log('1. Add to .dev.vars for local development')
console.log('2. Add to wrangler.jsonc for production')
console.log('3. Use in X-API-Key header: your_api_key')
```

Create `scripts/generate-admin-secret.js`:

```javascript
import crypto from 'crypto'

function generateAdminSecret() {
  return 'admin_' + crypto.randomBytes(32).toString('hex')
}

const secret = generateAdminSecret()
console.log('Generated Admin Secret:', secret)
console.log('\nSetup Instructions:')
console.log('1. Add to .dev.vars: ADMIN_SECRET=' + secret)
console.log('2. Add to wrangler.jsonc production environment')
console.log('3. Use in X-Admin-Secret header for admin operations')
```

## 🚀 Development and Deployment

### Step 18: Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Your API will be available at:
# - http://localhost:8787/health (health check)
# - http://localhost:8787/ui (Swagger UI)
# - http://localhost:8787/doc (OpenAPI spec)
```

### Step 19: Cloudflare Setup
```bash
# Install wrangler globally (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Verify login
wrangler whoami
```

### Step 20: Deploy to Production
```bash
# Generate production API keys
npm run generate-keys
npm run generate-admin-secret

# Update wrangler.jsonc with generated keys

# Deploy to production
npm run deploy:production

# Check deployment
wrangler deployments list --env production
```

## 🌐 Custom Domain Setup (Optional)

### Step 21: Add Custom Domain
If you have a domain managed by Cloudflare:

1. **Update wrangler.jsonc** with domain routing:
```jsonc
"env": {
  "production": {
    "routes": [
      {
        "pattern": "api.yourdomain.com/*",
        "zone_name": "yourdomain.com"
      }
    ]
  }
}
```

2. **Deploy with custom domain**:
```bash
npm run deploy:production
```

3. **Verify custom domain**:
```bash
curl https://api.yourdomain.com/health
```

## 📚 Documentation Files

### Step 22: Create README.md
Create a comprehensive README.md:

```markdown
# My Hono API

A production-ready API built with Hono framework and Cloudflare Workers.

## Features

- 🚀 Fast and lightweight with Hono framework
- 🔐 API key authentication
- 📖 OpenAPI/Swagger documentation
- 🌍 Global deployment with Cloudflare Workers
- 🔒 Rate limiting and security middleware
- 🧪 Test setup with Vitest
- 📝 TypeScript support

## Quick Start

1. Clone and install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .dev.vars
# Edit .dev.vars with your development keys
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

4. Visit http://localhost:8787/ui for API documentation

## API Endpoints

- `GET /health` - Health check
- `GET /ui` - Swagger UI documentation
- `GET /doc` - OpenAPI specification

## Environment Variables

- `API_KEYS` - Comma-separated list of valid API keys
- `ADMIN_SECRET` - Admin secret for management operations
- `ENVIRONMENT` - Current environment (development/staging/production)

## Deployment

\`\`\`bash
# Deploy to production
npm run deploy:production
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`
```

## ✅ Best Practices Summary

### Security
- ✅ Use API key authentication
- ✅ Implement rate limiting
- ✅ Validate all inputs with Zod
- ✅ Use environment variables for secrets
- ✅ Add CORS configuration

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Proper error handling
- ✅ OpenAPI documentation
- ✅ Test coverage

### Deployment
- ✅ Environment-specific configurations
- ✅ Automated deployment scripts
- ✅ Custom domain support
- ✅ Production monitoring

## 🔧 Troubleshooting

### Common Issues

1. **"process is not defined" error**
   - Solution: Don't use Node.js APIs in Cloudflare Workers
   - Use `c.env` instead of `process.env`

2. **Authentication not working**
   - Check environment variables are set correctly
   - Verify API key format and headers

3. **Deployment fails**
   - Check wrangler.jsonc syntax
   - Verify Cloudflare login: `wrangler whoami`

4. **Custom domain not working**
   - Ensure domain is managed by Cloudflare
   - Check zone configuration in wrangler.jsonc

### Debug Commands
```bash
# Check environment variables
curl http://localhost:8787/debug/env

# View deployment logs
npm run logs:production

# Check deployment status
wrangler deployments list --env production
```

## 🎯 Next Steps

After completing this setup:

1. **Add more endpoints** following the established patterns
2. **Implement database integration** (D1, KV, or external)
3. **Add authentication enhancements** (JWT, OAuth)
4. **Set up monitoring** and alerting
5. **Add CI/CD pipeline** with GitHub Actions
6. **Scale with additional services** as needed

## 📖 Additional Resources

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Zod Documentation](https://zod.dev/)

This guide provides everything needed to create a production-ready Hono + Cloudflare Workers API from scratch!
