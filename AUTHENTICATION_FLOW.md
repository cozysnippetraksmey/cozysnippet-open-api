# Authentication Flow Diagram

## Regular API Request Flow (/api/*)

```
1. Client Request
   ↓
   curl -H "X-API-Key: cz_abc123" /api/v1/users
   ↓

2. Cloudflare Worker Environment
   ↓
   Environment Variables:
   - API_KEYS = "cz_abc123,cz_def456,cz_ghi789"
   - ADMIN_SECRET = "admin_secret123"
   ↓

3. apiKeyAuth() Middleware
   ↓
   const apiKey = c.req.header('X-API-Key')  // Gets: "cz_abc123"
   ↓
   const validApiKeys = c.env?.API_KEYS?.split(',')  // Gets: ["cz_abc123", "cz_def456", "cz_ghi789"]
   ↓
   if (!validApiKeys.includes(apiKey))  // Checks: "cz_abc123" in array?
   ↓

4. Result
   ✅ PASS: Key found → Continue to actual API route
   ❌ FAIL: Key not found → Return 401 error
```

## Admin Request Flow (/admin/*)

```
1. Client Request
   ↓
   curl -H "X-Admin-Secret: admin_secret123" /admin/keys/generate
   ↓

2. Cloudflare Worker Environment
   ↓
   Environment Variables:
   - API_KEYS = "cz_abc123,cz_def456,cz_ghi789"
   - ADMIN_SECRET = "admin_secret123"
   ↓

3. adminAuth() Middleware
   ↓
   const adminSecret = c.req.header('X-Admin-Secret')  // Gets: "admin_secret123"
   ↓
   const validAdminSecret = c.env?.ADMIN_SECRET  // Gets: "admin_secret123"
   ↓
   if (adminSecret !== validAdminSecret)  // Checks: exact match?
   ↓

4. Result
   ✅ PASS: Secret matches → Continue to admin route
   ❌ FAIL: Secret doesn't match → Return 401 error
```

## Key Differences

| Aspect | Regular API Keys | Admin Secret |
|--------|-----------------|--------------|
| Storage | Comma-separated string | Single string |
| Validation | Array includes check | Direct string comparison |
| Usage | Multiple keys supported | One master secret |
| Purpose | Client API access | Key management |
| Routes | `/api/*` | `/admin/*` |
