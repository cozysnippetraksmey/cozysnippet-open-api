# .dev.vars Guide: Development vs Production Environment Variables

## 🎯 How .dev.vars Works in Cloudflare Workers

### What is .dev.vars?
`.dev.vars` is Cloudflare Workers' way of handling environment variables during **local development only**. It's similar to `.env` files in Node.js but specifically for Cloudflare Workers.

### How Wrangler Uses .dev.vars
When you run `wrangler dev`, it automatically:
1. ✅ Reads `.dev.vars` file from your project root
2. ✅ Loads variables into the local development environment
3. ✅ Makes them available via `c.env.VARIABLE_NAME`
4. ✅ Takes precedence over `wrangler.jsonc` vars during development

## 📁 File Priority Order (Development)

When running `wrangler dev`, Wrangler checks for environment variables in this order:

1. **`.dev.vars`** (highest priority) 
2. **`wrangler.jsonc` vars section** (fallback)
3. **Command line arguments** (if any)

## 🔧 Your Current Setup Analysis

### Current .dev.vars File:
```bash
API_KEYS=cz_dev_key_for_local_development_only,cz_dev_another_key
ADMIN_SECRET=admin_dev_secret_change_in_production
ENVIRONMENT=development
```

### Current wrangler.jsonc vars:
```jsonc
"vars": {
  "API_KEYS": "cz_dev_key_for_local_development_only",
  "ADMIN_SECRET": "admin_dev_secret_change_in_production"
}
```

**Result**: When you run `npm run dev`, it will use `.dev.vars` values (which override wrangler.jsonc).

## 🌍 Complete Environment Setup Guide

### 1. Development Environment

**Option A: Using .dev.vars (Recommended for secrets)**
```bash
# .dev.vars (for local development)
API_KEYS=cz_dev_key_local_1,cz_dev_key_local_2
ADMIN_SECRET=admin_local_secret_very_secure
ENVIRONMENT=development
DATABASE_URL=postgresql://localhost:5432/dev_db
```

**Option B: Using wrangler.jsonc only**
```jsonc
{
  "vars": {
    "API_KEYS": "cz_dev_key_for_local_development_only",
    "ADMIN_SECRET": "admin_dev_secret_change_in_production"
  }
}
```

### 2. Production Environment

**For production, you have THREE options:**

**Option A: wrangler.jsonc (current setup)**
```jsonc
{
  "env": {
    "production": {
      "vars": {
        "API_KEYS": "cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW",
        "ADMIN_SECRET": "admin_zqGMQYGorQ#jUAB1Ed2@@!xtxh5Y@2X..."
      }
    }
  }
}
```

**Option B: wrangler secrets (most secure)**
```bash
# Set secrets for production (more secure)
wrangler secret put API_KEYS --env production
wrangler secret put ADMIN_SECRET --env production
```

**Option C: .env.production file (NOT recommended)**
```bash
# .env.production (not standard for Cloudflare Workers)
API_KEYS=production_keys_here
ADMIN_SECRET=production_admin_secret
```

## 🔐 Security Recommendations

### Development: Use .dev.vars
- ✅ Automatically ignored by git (if properly configured)
- ✅ Easy to manage locally
- ✅ No risk of committing secrets

### Production: Use wrangler secrets
- ✅ Most secure option
- ✅ Secrets stored encrypted in Cloudflare
- ✅ Not visible in wrangler.jsonc

## 📋 .env.example File

**Yes, you should create .env.example** for documentation purposes:

```bash
# .env.example (template for other developers)
API_KEYS=your_development_api_keys_here
ADMIN_SECRET=your_development_admin_secret_here
ENVIRONMENT=development
```

This helps other developers understand what environment variables they need to set up.

## 🧪 Testing .dev.vars Configuration

### Test 1: Verify .dev.vars is being read
```bash
# Run this to check if .dev.vars is loaded
wrangler dev --local --var TEST_VAR=test_value
```

### Test 2: Check environment variables in your app
Add this debug endpoint to verify:

```typescript
// Add to your app for testing (remove in production)
app.get('/debug/env', (c) => {
  return c.json({
    source: '.dev.vars or wrangler.jsonc',
    environment: c.env.ENVIRONMENT,
    hasApiKeys: !!c.env.API_KEYS,
    apiKeysCount: c.env.API_KEYS?.split(',').length || 0,
    hasAdminSecret: !!c.env.ADMIN_SECRET
  })
})
```

## 🚀 Best Practices Setup

### 1. Update .gitignore
```bash
# Add to .gitignore
.dev.vars
*.env
.env.*
!.env.example
```

### 2. Create comprehensive .env.example
```bash
# .env.example
API_KEYS=cz_dev_key_example_1,cz_dev_key_example_2
ADMIN_SECRET=admin_dev_secret_example
ENVIRONMENT=development
# Add any other environment variables your app uses
```

### 3. Production secrets setup
```bash
# For production deployment
wrangler secret put API_KEYS --env production
wrangler secret put ADMIN_SECRET --env production
```

## 📊 Environment Variable Sources by Environment

| Environment | Primary Source | Fallback | Use Case |
|-------------|---------------|----------|----------|
| **Development** | `.dev.vars` | `wrangler.jsonc` vars | Local testing |
| **Production** | `wrangler secrets` | `wrangler.jsonc` env.production.vars | Live deployment |
| **Staging** | `wrangler secrets` | `wrangler.jsonc` env.staging.vars | Pre-production testing |

## 🔄 Migration Guide

### Current State ➜ Recommended Setup

**Step 1: Keep your current .dev.vars**
```bash
# Your current .dev.vars is good
API_KEYS=cz_dev_key_for_local_development_only,cz_dev_another_key
ADMIN_SECRET=admin_dev_secret_change_in_production
ENVIRONMENT=development
```

**Step 2: Update .gitignore**
```bash
echo ".dev.vars" >> .gitignore
echo "*.env" >> .gitignore
echo "!.env.example" >> .gitignore
```

**Step 3: Create .env.example**
```bash
cp .dev.vars .env.example
# Then edit .env.example to remove real secrets
```

**Step 4: Move production secrets to wrangler secrets (optional but recommended)**
```bash
wrangler secret put API_KEYS --env production
# Enter: cz_DOra0Y8I9u18Knkdf8GxJefmX3cdQAhW

wrangler secret put ADMIN_SECRET --env production  
# Enter: admin_zqGMQYGorQ#jUAB1Ed2@@!xtxh5Y@2X...
```

## ❓ Common Questions Answered

**Q: Do I need .dev.vars if I have wrangler.jsonc vars?**
A: No, but .dev.vars is more secure and convenient for development.

**Q: Does .dev.vars work in production?**
A: No, .dev.vars is only for local development with `wrangler dev`.

**Q: Should I commit .dev.vars to git?**
A: No, add it to .gitignore to avoid committing secrets.

**Q: Can I use both .dev.vars and wrangler.jsonc vars?**
A: Yes, .dev.vars takes priority during development.

**Q: How do I verify .dev.vars is being used?**
A: Check the debug endpoint or look at wrangler dev output.
