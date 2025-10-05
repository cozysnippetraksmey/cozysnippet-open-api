# Authentication Guide

## Overview
This API uses a simple but secure API key authentication system with two levels of access:

1. **API Key Authentication** - For general API access (`/api/*` routes)
2. **Admin Authentication** - For administrative operations (`/admin/*` routes)

## How Authentication Works

### API Key Flow
1. Client sends request to protected endpoint (e.g., `/api/v1/users`)
2. API checks for API key in headers:
   - `X-API-Key: your_api_key`
   - OR `Authorization: Bearer your_api_key`
3. Server validates key against environment variable `API_KEYS`
4. If valid, request proceeds; if invalid, returns 401 error

### Admin Authentication Flow
1. Client sends request to admin endpoint (e.g., `/admin/keys`)
2. API checks for admin secret in header: `X-Admin-Secret: your_admin_secret`
3. Server validates against environment variable `ADMIN_SECRET`
4. If valid, request proceeds; if invalid, returns 401 error

## API Key Storage and Validation

### Environment Variables
- `API_KEYS`: Comma-separated list of valid API keys
- `ADMIN_SECRET`: Single admin secret for key management

Example:
```
API_KEYS=cz_dev_key_for_local_development_only,cz_prod_key_abc123,cz_another_key_xyz789
ADMIN_SECRET=admin_dev_secret_change_in_production
```

### Key Format Recommendations
- Use prefixes for identification: `cz_` for your API
- Include environment indicator: `dev_`, `prod_`, `staging_`
- Use secure random strings: minimum 32 characters
- Example: `cz_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

## Using the API

### In Swagger UI
1. Go to your API documentation at `/ui`
2. Click the **Authorize** button (lock icon) at the top
3. Enter your API key in the `ApiKeyAuth` field
4. For admin endpoints, also fill the `AdminAuth` field
5. Click **Authorize** and **Close**

### In Code Examples

#### JavaScript/Fetch
```javascript
// API Key Authentication
const response = await fetch('http://localhost:8787/api/v1/users', {
  headers: {
    'X-API-Key': 'cz_dev_key_for_local_development_only',
    'Content-Type': 'application/json'
  }
});

// OR using Bearer token
const response = await fetch('http://localhost:8787/api/v1/users', {
  headers: {
    'Authorization': 'Bearer cz_dev_key_for_local_development_only',
    'Content-Type': 'application/json'
  }
});

// Admin Authentication
const adminResponse = await fetch('http://localhost:8787/admin/keys', {
  headers: {
    'X-Admin-Secret': 'admin_dev_secret_change_in_production',
    'Content-Type': 'application/json'
  }
});
```

#### cURL
```bash
# API Key Authentication
curl -X GET "http://localhost:8787/api/v1/users" \
  -H "X-API-Key: cz_dev_key_for_local_development_only"

# Admin Authentication
curl -X GET "http://localhost:8787/admin/keys" \
  -H "X-Admin-Secret: admin_dev_secret_change_in_production"
```

## Security Best Practices

### Development
- Use clearly marked development keys
- Never commit real keys to version control
- Use `.env` files or environment variables

### Production
- Generate strong, unique API keys (use the provided scripts)
- Rotate keys regularly
- Monitor key usage and implement rate limiting
- Use HTTPS only
- Log authentication attempts

## Key Management

### Generating New Keys
```bash
# Generate new API keys
npm run generate-keys

# Generate new admin secret
npm run generate-admin-secret
```

### Lost Key Recovery
If you lose your API keys or admin secret:

1. **For Development:**
   - Check your `wrangler.jsonc` file
   - Default dev key: `cz_dev_key_for_local_development_only`
   - Default admin secret: `admin_dev_secret_change_in_production`

2. **For Production:**
   - Generate new keys using the scripts
   - Update environment variables in Cloudflare Workers dashboard
   - Redeploy the application

### Emergency Access
If you're completely locked out:
1. Generate new credentials: `npm run generate-keys && npm run generate-admin-secret`
2. Update `wrangler.production.jsonc` with new values
3. Deploy: `npm run deploy:production`

## API Endpoints

### Public Endpoints (No Authentication)
- `GET /health` - Health check
- `GET /ui` - API documentation
- `GET /doc` - OpenAPI specification

### Protected Endpoints (API Key Required)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Admin Endpoints (Admin Secret Required)
- `GET /admin/keys` - List API key information
- `POST /admin/keys/rotate` - Rotate API keys
- `GET /admin/stats` - Get API usage statistics

## Error Responses

### Missing API Key (401)
```json
{
  "success": false,
  "error": {
    "code": "MISSING_API_KEY",
    "message": "API key is required. Provide it in X-API-Key header or Authorization header as Bearer token."
  },
  "timestamp": "2025-10-04T16:52:05.407Z"
}
```

### Invalid API Key (401)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key provided"
  },
  "timestamp": "2025-10-04T16:52:05.407Z"
}
```

### Missing Admin Secret (403)
```json
{
  "success": false,
  "error": {
    "code": "MISSING_ADMIN_SECRET",
    "message": "Admin secret is required for this operation"
  },
  "timestamp": "2025-10-04T16:52:05.407Z"
}
```
