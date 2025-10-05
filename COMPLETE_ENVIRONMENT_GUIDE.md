# Complete Environment Variables Guide for Cloudflare Workers + Hono

## 🎯 Overview

This guide covers everything about environment variables in your Cloudflare Workers + Hono API setup. After reading this, you'll never be confused about environment variables again!

## 📁 Current Project Structure

```
cozysnippet-open-api/
├── wrangler.jsonc           # Main configuration file (ALL environments)
├── .dev.vars               # Local development secrets (gitignored)
├── .env.example            # Template for other developers
├── .gitignore              # Protects your secrets
└── src/index.ts            # Your Hono app
```

## 🔍 Environment Variables Sources by Context

### Development (Local)
| Priority | Source | File | Usage |
|----------|--------|------|-------|
| 1 | `.dev.vars` | Local file | `npm run dev` |
| 2 | `wrangler.jsonc` main vars | Config file | Fallback if no `.dev.vars` |
| 3 | `wrangler.jsonc` env.development | Config file | `wrangler dev --env development` |

### Production (Cloudflare)
| Priority | Source | File | Usage |
|----------|--------|------|-------|
| 1 | `wrangler.jsonc` env.production.vars | Config file | `npm run deploy:production` |
| 2 | `wrangler secrets` | Cloudflare encrypted | Most secure option |
| 3 | Cloudflare Dashboard | Web interface | Manual setup |

### Staging (Cloudflare)
| Priority | Source | File | Usage |
|----------|--------|------|-------|
| 1 | `wrangler.jsonc` env.staging.vars | Config file | `npm run deploy:staging` |

## 📋 Your Current Configuration Analysis

Based on your `wrangler.jsonc`, here's exactly what happens in each environment:

### 🛠️ Development Environment
```bash
# When you run: npm run dev
```

**Source Priority:**
1. **`.dev.vars` file** (if exists) - HIGHEST PRIORITY
2. **`wrangler.jsonc` main vars** (fallback)

**Your Current Values:**
```bash
ENVIRONMENT=development
API_KEYS=cz_dev_key_for_local_development_only
ADMIN_SECRET=admin_dev_secret_change_in_production
```

**How to Verify:**
```bash
curl http://localhost:8787/debug/env
# Should show: "environmentSource": "dev-vars"
```

### 🏭 Production Environment
```bash
# When you run: npm run deploy:production
```

**Source:** `wrangler.jsonc` → `env.production.vars`

**Your Current Values:**
```bash
ENVIRONMENT=production
API_KEYS=cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW
ADMIN_SECRET=admin_zqGMQYGorQ#jUAB1Ed2@@!xtxh5Y@2XVY5%mZ1ET4C&Fw4cG
```

**How to Verify:**
```bash
curl https://api.cozysnippet.com/debug/env
# Should show: "environmentSource": "wrangler-jsonc-production"
```

### 🔬 Staging Environment
```bash
# When you run: npm run deploy:staging
```

**Source:** `wrangler.jsonc` → `env.staging.vars`

**Your Current Values:**
```bash
ENVIRONMENT=staging
API_KEYS=cz_staging_test_keys_here
ADMIN_SECRET=admin_staging_test_secret_here
```

## 🔧 How to Access Environment Variables in Code

### In Your Hono App
```typescript
// Define environment interface
type Bindings = {
  API_KEYS: string
  ADMIN_SECRET: string
  ENVIRONMENT?: string
}

// Use in handlers
app.get('/some-route', (c: Context<{ Bindings: Bindings }>) => {
  const apiKeys = c.env.API_KEYS?.split(',') || []
  const adminSecret = c.env.ADMIN_SECRET
  const environment = c.env.ENVIRONMENT
  
  // Your logic here
})
```

### In Middleware
```typescript
export const apiKeyAuth = () => {
  return async (c: Context<{ Bindings: Bindings }>, next: Next) => {
    const providedKey = c.req.header('X-API-Key')
    const validKeys = c.env.API_KEYS?.split(',').map(k => k.trim()) || []
    
    if (!validKeys.includes(providedKey)) {
      return c.json({ error: 'Invalid API key' }, 401)
    }
    
    await next()
  }
}
```

## 📝 File Management Guide

### 1. .dev.vars (Local Development Secrets)

**Purpose:** Store development secrets locally
**Location:** Project root
**Committed to Git:** NO (already in .gitignore)

**Current Content:**
```bash
API_KEYS=cz_dev_key_for_local_development_only,cz_dev_another_key
ADMIN_SECRET=admin_dev_secret_change_in_production
ENVIRONMENT=development
```

**When Used:** Automatically when running `npm run dev`

### 2. .env.example (Template)

**Purpose:** Show other developers what environment variables are needed
**Location:** Project root
**Committed to Git:** YES (safe template)

**Current Content:**
```bash
# Environment Variables Template
# Copy this to .dev.vars for local development

# API Keys (comma-separated list of valid API keys)
API_KEYS=cz_dev_key_example_1,cz_dev_key_example_2

# Admin Secret (for administrative operations)
ADMIN_SECRET=admin_dev_secret_example_change_this

# Environment identifier
ENVIRONMENT=development
```

### 3. wrangler.jsonc (All Environments Configuration)

**Purpose:** Configure all environments (dev, staging, production)
**Location:** Project root
**Committed to Git:** YES (production values are okay to be visible)

**Structure Explanation:**
```jsonc
{
  // Default/fallback environment (used if .dev.vars doesn't exist)
  "vars": {
    "ENVIRONMENT": "development",
    "API_KEYS": "fallback_dev_key",
    "ADMIN_SECRET": "fallback_dev_secret"
  },
  
  // Environment-specific configurations
  "env": {
    "development": {
      // Used with: wrangler dev --env development
      "vars": { /* development values */ }
    },
    "production": {
      // Used with: npm run deploy:production
      "name": "cozysnippet-api-prod",
      "vars": { /* production values */ },
      "routes": [ /* custom domain routing */ ]
    },
    "staging": {
      // Used with: npm run deploy:staging
      "vars": { /* staging values */ }
    }
  }
}
```

## 🚀 Deployment Commands and Their Environment Sources

### Local Development
```bash
# Method 1: Standard development (uses .dev.vars if exists)
npm run dev
# Source: .dev.vars → wrangler.jsonc main vars (fallback)

# Method 2: Specific development environment
wrangler dev --env development
# Source: wrangler.jsonc env.development.vars

# Method 3: Custom environment file
wrangler dev --env-file .my-custom-vars
# Source: Your custom file
```

### Production Deployment
```bash
# Deploy to production
npm run deploy:production
# Equivalent to: wrangler deploy --env production --minify
# Source: wrangler.jsonc env.production.vars
```

### Staging Deployment
```bash
# Deploy to staging
npm run deploy:staging
# Equivalent to: wrangler deploy --env staging --minify
# Source: wrangler.jsonc env.staging.vars
```

## 🔍 How to Verify Which Environment Source is Active

### Method 1: Debug Endpoint (Recommended)
```bash
# Development
curl http://localhost:8787/debug/env

# Production
curl https://api.cozysnippet.com/debug/env

# Look for these fields:
{
  "environmentSource": "dev-vars|wrangler-jsonc-main|wrangler-jsonc-production",
  "environment": "development|production|staging",
  "detectedSource": "Human readable description",
  "deploymentContext": "local-development|cloudflare-production"
}
```

### Method 2: Check ENVIRONMENT Variable
- `ENVIRONMENT=development` → Using .dev.vars or development config
- `ENVIRONMENT=production` → Using production config
- `ENVIRONMENT=staging` → Using staging config
- `ENVIRONMENT=not_set` → Using fallback config

### Method 3: Wrangler Deployment Output
```bash
# Production deployment shows:
env.ENVIRONMENT ("production")
env.API_KEYS ("cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW")
env.ADMIN_SECRET ("admin_zqGMQYGorQ#jUAB1Ed2@@!xtxh5Y@2X...")
```

## 🔐 Security Best Practices

### ✅ What's Safe to Commit
- `wrangler.jsonc` ✅ (production values are okay to be visible)
- `.env.example` ✅ (template only)
- `package.json` ✅ (no secrets)
- Source code ✅ (uses c.env pattern)

### ❌ What's Protected (Never Commit)
- `.dev.vars` ❌ (contains real development secrets)
- `.env` ❌ (if you create one)
- `.prod.vars` ❌ (don't create this)
- Any file with real secrets ❌

### 🛡️ .gitignore Configuration
Your `.gitignore` already protects secrets:
```bash
# env
.env
.env.production
.dev.vars
```

## 🛠️ Common Operations

### Adding a New Environment Variable

**Step 1: Add to .dev.vars (for development)**
```bash
# Add to .dev.vars
NEW_VARIABLE=dev_value_here
```

**Step 2: Add to wrangler.jsonc (for production)**
```jsonc
"env": {
  "production": {
    "vars": {
      // ...existing vars...
      "NEW_VARIABLE": "production_value_here"
    }
  }
}
```

**Step 3: Update TypeScript interface**
```typescript
type Bindings = {
  API_KEYS: string
  ADMIN_SECRET: string
  ENVIRONMENT?: string
  NEW_VARIABLE?: string  // Add this line
}
```

**Step 4: Update .env.example**
```bash
# Add to .env.example
NEW_VARIABLE=example_value_for_documentation
```

### Rotating API Keys

**Development:**
```bash
# 1. Generate new keys
npm run generate-keys

# 2. Update .dev.vars
# Edit .dev.vars with new keys
```

**Production:**
```bash
# 1. Generate new keys
npm run generate-keys

# 2. Update wrangler.jsonc
# Edit env.production.vars with new keys

# 3. Deploy
npm run deploy:production
```

### Switching Between Environment Sources

**Use .dev.vars (standard):**
```bash
npm run dev
```

**Use wrangler.jsonc development environment:**
```bash
wrangler dev --env development
```

**Use custom file:**
```bash
wrangler dev --env-file .my-custom-vars
```

## 🧪 Testing Your Environment Setup

### Test 1: Verify Development Environment
```bash
# Start development server
npm run dev

# Test debug endpoint
curl http://localhost:8787/debug/env

# Expected response:
{
  "environmentSource": "dev-vars",
  "environment": "development",
  "deploymentContext": "local-development"
}
```

### Test 2: Verify Production Environment
```bash
# Deploy to production
npm run deploy:production

# Test debug endpoint
curl https://api.cozysnippet.com/debug/env

# Expected response:
{
  "environmentSource": "wrangler-jsonc-production",
  "environment": "production",
  "deploymentContext": "cloudflare-production"
}
```

### Test 3: Verify API Keys Work
```bash
# Development
curl -H "X-API-Key: cz_dev_key_for_local_development_only" \
     http://localhost:8787/api/v1/users

# Production
curl -H "X-API-Key: cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW" \
     https://api.cozysnippet.com/api/v1/users
```

## 🎯 Quick Reference Cheat Sheet

| Want to... | Command | Environment Source |
|-----------|---------|-------------------|
| **Develop locally** | `npm run dev` | `.dev.vars` (priority) → `wrangler.jsonc` main vars (fallback) |
| **Deploy to production** | `npm run deploy:production` | `wrangler.jsonc` env.production.vars |
| **Deploy to staging** | `npm run deploy:staging` | `wrangler.jsonc` env.staging.vars |
| **Use custom dev file** | `wrangler dev --env-file .custom` | Your custom file |
| **Debug environment** | `curl .../debug/env` | Shows current source |

## 🔄 Migration Scenarios

### From Node.js to Cloudflare Workers
```bash
# ❌ Old Node.js way (doesn't work in Workers)
const apiKey = process.env.API_KEY

# ✅ New Cloudflare Workers way (your current setup)
const apiKey = c.env.API_KEYS
```

### From Multiple .env Files to Wrangler
```bash
# ❌ Old way (multiple .env files)
.env.development
.env.production
.env.staging

# ✅ New way (single wrangler.jsonc + .dev.vars)
wrangler.jsonc  # All environments
.dev.vars       # Local development only
```

## 🚨 Troubleshooting

### Problem: Environment variables not loading
**Solution:** Check priority order and file existence

### Problem: Wrong environment values in production
**Solution:** Verify you're deploying with correct environment flag

### Problem: API keys not working
**Solution:** Check comma separation and whitespace in API_KEYS

### Problem: .dev.vars not being used
**Solution:** Ensure file exists and `npm run dev` command is used

## 🎉 Summary

Your current setup is **perfect** and follows Cloudflare Workers best practices:

✅ **Development:** Uses `.dev.vars` for local secrets (secure, not committed)
✅ **Production:** Uses `wrangler.jsonc` env.production.vars (deployed, visible)
✅ **Documentation:** Has `.env.example` for other developers
✅ **Security:** All secret files are properly gitignored
✅ **Flexibility:** Supports multiple environments and custom domain
✅ **Debugging:** Has debug endpoint to verify which source is active

**You're all set!** This is exactly how professional Cloudflare Workers applications should be configured.
