# Environment Variables Guide for Hono + Cloudflare Workers

## 🔄 Key Difference: Traditional Node.js vs Cloudflare Workers

### ❌ Traditional Node.js (DOESN'T work in Cloudflare Workers)
```javascript
// This is how you'd normally use environment variables in Node.js
const apiKey = process.env.API_KEY        // ❌ Won't work in Workers
const dbUrl = process.env.DATABASE_URL    // ❌ Won't work in Workers

// Loading from .env file (Node.js)
require('dotenv').config()                // ❌ Won't work in Workers
```

### ✅ Cloudflare Workers (How YOUR app works)
```typescript
// This is how environment variables work in Cloudflare Workers
const apiKey = c.env.API_KEYS            // ✅ From Cloudflare Workers context
const adminSecret = c.env.ADMIN_SECRET   // ✅ From Cloudflare Workers context
const environment = c.env.ENVIRONMENT    // ✅ From Cloudflare Workers context
```

## 📁 Where Environment Variables are Defined

### 1. **In wrangler.jsonc (Your current setup)**
```jsonc
{
  "vars": {
    "API_KEYS": "cz_dev_key_for_local_development_only",
    "ADMIN_SECRET": "admin_dev_secret_change_in_production"
  },
  "env": {
    "production": {
      "vars": {
        "ENVIRONMENT": "production",
        "API_KEYS": "cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW",
        "ADMIN_SECRET": "admin_zqGMQYGorQ#jUAB1Ed2@@!xtxh5Y@2XVY5%mZ1ET4C&Fw4cG"
      }
    }
  }
}
```

### 2. **Using .dev.vars file (For local development)**
Create a `.dev.vars` file in your project root:
```bash
# .dev.vars (for local development only)
API_KEYS=cz_dev_key_for_local_development_only
ADMIN_SECRET=admin_dev_secret_change_in_production
ENVIRONMENT=development
```

### 3. **Using wrangler secrets (For sensitive data)**
```bash
# For production secrets (more secure)
wrangler secret put API_KEYS --env production
wrangler secret put ADMIN_SECRET --env production
```

## 🏗️ TypeScript Interface Definition

In your Hono app, you need to define the environment interface:

```typescript
// Define environment variables interface
interface Env {
  API_KEYS?: string
  ADMIN_SECRET?: string
  ENVIRONMENT?: string
  // Add more environment variables here as needed
}

// Use it in your Hono app
const app = new OpenAPIHono<{ Bindings: Env }>()
```

## 📖 How to Access Environment Variables in Your Code

### In Route Handlers
```typescript
// In your route handlers (like admin.ts)
const handler = async (c: Context<{ Bindings: Env }>) => {
  // Access environment variables through c.env
  const apiKeys = c.env.API_KEYS?.split(',') || []
  const adminSecret = c.env.ADMIN_SECRET
  const environment = c.env.ENVIRONMENT
  
  // Use them in your logic
  if (!adminSecret) {
    return c.json({ error: 'Admin secret not configured' }, 500)
  }
  
  return c.json({ success: true })
}
```

### In Middleware
```typescript
// In middleware (like auth.ts)
export const apiKeyAuth = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const providedKey = c.req.header('X-API-Key')
    
    // Get valid keys from environment
    const validKeys = c.env.API_KEYS?.split(',').map(k => k.trim()) || []
    
    if (!validKeys.includes(providedKey)) {
      return c.json({ error: 'Invalid API key' }, 401)
    }
    
    await next()
  }
}
```

## 🌍 Environment-Specific Configuration

Your current setup supports multiple environments:

### Development (Default)
```bash
npm run dev
# Uses: vars from main section of wrangler.jsonc
```

### Production
```bash
npm run deploy:production
# Uses: vars from env.production section of wrangler.jsonc
```

### Staging
```bash
npm run deploy:staging
# Uses: vars from env.staging section of wrangler.jsonc
```

## 🔐 Security Best Practices

### 1. **Use .dev.vars for local development**
```bash
# Create .dev.vars file (automatically ignored by git)
echo "API_KEYS=cz_dev_key_local" > .dev.vars
echo "ADMIN_SECRET=admin_local_secret" >> .dev.vars
```

### 2. **Use wrangler secrets for production**
```bash
# More secure for production
wrangler secret put API_KEYS --env production
# Enter your production API keys when prompted

wrangler secret put ADMIN_SECRET --env production
# Enter your production admin secret when prompted
```

### 3. **Never commit secrets to git**
```bash
# Add to .gitignore
echo ".dev.vars" >> .gitignore
echo "*.env" >> .gitignore
```

## 📊 Current Environment Variables in Your App

Based on your wrangler.jsonc, you currently have:

| Variable | Development | Production | Purpose |
|----------|-------------|------------|---------|
| `API_KEYS` | `cz_dev_key_for_local_development_only` | `cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW` | API authentication keys |
| `ADMIN_SECRET` | `admin_dev_secret_change_in_production` | `admin_zqGMQYGorQ#jUAB1Ed2@@!xtxh5Y@2X...` | Admin operations secret |
| `ENVIRONMENT` | (not set) | `production` | Environment identifier |

## 🛠️ Common Patterns in Your Code

### 1. **Checking if environment variables exist**
```typescript
const handler = (c: Context<{ Bindings: Env }>) => {
  if (!c.env.API_KEYS) {
    return c.json({ error: 'API_KEYS not configured' }, 500)
  }
  
  // Continue with logic...
}
```

### 2. **Using environment-specific logic**
```typescript
const handler = (c: Context<{ Bindings: Env }>) => {
  const isProd = c.env.ENVIRONMENT === 'production'
  
  if (isProd) {
    // Production-specific logic
    console.log('Running in production mode')
  } else {
    // Development-specific logic
    console.log('Running in development mode')
  }
}
```

### 3. **Parsing comma-separated values**
```typescript
const handler = (c: Context<{ Bindings: Env }>) => {
  // Your API_KEYS is stored as comma-separated string
  const apiKeys = c.env.API_KEYS?.split(',').map(key => key.trim()) || []
  
  // Now you have an array of API keys
  console.log(`Found ${apiKeys.length} API keys`)
}
```

## 🚀 Quick Setup Commands

### For local development with .dev.vars:
```bash
# Create .dev.vars file
cat > .dev.vars << EOF
API_KEYS=cz_dev_key_for_local_development_only,cz_dev_another_key
ADMIN_SECRET=admin_dev_secret_change_in_production
ENVIRONMENT=development
EOF

# Run development server
npm run dev
```

### For production deployment:
```bash
# Deploy with environment variables from wrangler.jsonc
npm run deploy:production
```

## 🔍 Debugging Environment Variables

Add this debug endpoint to see what environment variables are available:

```typescript
// Debug endpoint (remove in production)
app.get('/debug/env', (c) => {
  return c.json({
    hasApiKeys: !!c.env.API_KEYS,
    hasAdminSecret: !!c.env.ADMIN_SECRET,
    environment: c.env.ENVIRONMENT || 'not_set',
    apiKeysCount: c.env.API_KEYS?.split(',').length || 0
  })
})
```

Your current setup is correctly configured for Cloudflare Workers! You're using the right pattern with `c.env` instead of `process.env`.
