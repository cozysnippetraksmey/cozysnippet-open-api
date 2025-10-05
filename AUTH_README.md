# API Authentication Setup

## Overview
Your CozySnippet API now includes a secure API key authentication system with admin key management capabilities - perfect for production deployment on Cloudflare Workers.

## Features
- Simple API key authentication
- **Admin key management system** (NEW!)
- **Lost key recovery** (NEW!)
- Secure key generation
- Environment-based configuration
- Support for multiple API keys
- Proper error handling
- No dependencies on external auth services

## Setup Instructions

### 1. Generate Admin Secret (One-time setup)
```bash
# Generate a secure admin secret
npm run generate-admin-secret
```

### 2. Set Up Production Secrets
```bash
# Set your admin secret (keep this VERY secure!)
wrangler secret put ADMIN_SECRET

# Set your initial API keys
wrangler secret put API_KEYS
```

### 3. Generate API Keys
```bash
# Generate 1 API key
npm run generate-keys

# Generate multiple keys (e.g., 3 keys)
npm run generate-keys 3
```

## 🔧 Admin Key Management (Solution for Lost Keys!)

### Generate New API Keys via Admin Endpoint
If you forget or lose your API keys, you can generate new ones using the admin endpoint:

```bash
# Generate 3 new API keys
curl -X POST \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"count": 3}' \
  https://your-api.workers.dev/admin/keys/generate
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keys": ["cz_abc123...", "cz_def456...", "cz_ghi789..."],
    "count": 3,
    "instructions": {
      "setup": "wrangler secret put API_KEYS",
      "value": "cz_abc123...,cz_def456...,cz_ghi789...",
      "usage": "Include one of these keys in X-API-Key header or Authorization: Bearer header"
    }
  }
}
```

### Check Current API Keys Info
```bash
curl -H "X-Admin-Secret: YOUR_ADMIN_SECRET" \
  https://your-api.workers.dev/admin/keys/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalKeys": 3,
    "keyPrefixes": ["cz_VpPT9...", "cz_kL8Mn...", "cz_R3xYz..."],
    "configured": true,
    "lastUpdated": "2025-10-04T12:00:00.000Z"
  }
}
```

## 🚨 Lost Key Recovery Process

**If you lose your API keys:**

1. **Use the admin endpoint** to generate new keys:
   ```bash
   curl -X POST -H "X-Admin-Secret: YOUR_ADMIN_SECRET" \
     -d '{"count": 2}' \
     https://your-api.workers.dev/admin/keys/generate
   ```

2. **Update your Cloudflare secrets** with the new keys:
   ```bash
   wrangler secret put API_KEYS
   # Enter the new keys from the response
   ```

3. **Update your clients** with the new API keys

**If you lose your admin secret:**
- You'll need to regenerate it locally: `npm run generate-admin-secret`
- Set it in Cloudflare: `wrangler secret put ADMIN_SECRET`

## Development Setup
Development keys are already configured in `wrangler.jsonc`:
- API Key: `cz_dev_key_for_local_development_only`
- Admin Secret: `admin_dev_secret_change_in_production`

## Client Usage
Your API clients can authenticate using either header format:

**Option 1: X-API-Key header**
```bash
curl -H "X-API-Key: cz_your_api_key_here" \
  https://your-api.workers.dev/api/v1/users
```

**Option 2: Authorization Bearer header**
```bash
curl -H "Authorization: Bearer cz_your_api_key_here" \
  https://your-api.workers.dev/api/v1/users
```

## Protected Routes
- All routes under `/api/*` require authentication
- The `/health` endpoint remains public for monitoring

## Error Responses
The API returns clear error messages for authentication failures:

```json
{
  "success": false,
  "error": {
    "code": "MISSING_API_KEY",
    "message": "API key is required. Provide it in X-API-Key header or Authorization header as Bearer token."
  }
}
```

## Security Features
- Keys are prefixed with `cz_` for easy identification
- 32-character random strings for high entropy
- Environment variable storage (not in code)
- Multiple key support for different clients/environments
- Rate limiting still applies on top of authentication
