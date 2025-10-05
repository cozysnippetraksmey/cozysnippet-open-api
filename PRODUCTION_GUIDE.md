# 🚀 CozySnippet API - Production Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Security Setup](#security-setup)
4. [Deployment Process](#deployment-process)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Code linted and formatted (`npm run lint`)
- [ ] Dependencies updated and secure
- [ ] Remove all console.log statements
- [ ] Remove development-only code

### ✅ Security Review
- [ ] No hardcoded secrets in code
- [ ] API keys properly configured
- [ ] CORS settings configured for production domains
- [ ] Rate limiting properly configured
- [ ] Input validation in place
- [ ] Error messages don't leak sensitive information

### ✅ Performance
- [ ] Rate limiting configured appropriately
- [ ] Response caching considered
- [ ] Bundle size optimized
- [ ] Database queries optimized (if applicable)

## Environment Configuration

### 1. Generate Production API Keys
```bash
# Generate secure API keys for production
npm run generate-keys 5  # Generate 5 keys for different clients

# Generate admin secret
npm run generate-admin-secret
```

### 2. Configure Cloudflare Workers Secrets
```bash
# Set production API keys (comma-separated)
wrangler secret put API_KEYS
# Enter: cz_prod_key1,cz_prod_key2,cz_prod_key3,cz_prod_key4,cz_prod_key5

# Set admin secret (keep this extremely secure!)
wrangler secret put ADMIN_SECRET
# Enter: your_generated_admin_secret

# Optional: Add other production secrets
wrangler secret put DATABASE_URL  # If using external database
wrangler secret put WEBHOOK_SECRET  # If using webhooks
```

### 3. Environment-Specific Configuration
Create production-specific wrangler configuration:

```bash
# Create production environment file
cp wrangler.jsonc wrangler.prod.jsonc
```

Update `wrangler.prod.jsonc`:
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "cozysnippet-api-prod",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-05",
  "env": {
    "production": {
      "name": "cozysnippet-api",
      "routes": [
        {
          "pattern": "api.yourdomain.com/*",
          "custom_domain": true
        }
      ],
      "vars": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

## Security Setup

### 1. Update CORS for Production
Update your `src/index.ts`:
```typescript
app.use('*', cors({
    origin: [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
        'https://app.yourdomain.com'
        // Remove localhost and * for production
    ],
    allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Admin-Secret'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))
```

### 2. Update Rate Limiting for Production
```typescript
app.use('*', rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // Increased for production
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
}))
```

### 3. Add Security Headers
Add a security middleware:
```typescript
app.use('*', async (c, next) => {
  await next()
  
  // Security headers
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
})
```

## Deployment Process

### 1. Build and Test
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### 2. Deploy to Cloudflare Workers
```bash
# Deploy to production
npm run deploy

# Or deploy with specific environment
wrangler deploy --env production --minify

# Deploy with custom domain
wrangler deploy --env production --routes "api.yourdomain.com/*"
```

### 3. Custom Domain Setup (Optional)
```bash
# Add custom domain
wrangler domains add api.yourdomain.com

# Verify domain
wrangler domains verify api.yourdomain.com
```

## Post-Deployment Verification

### 1. Health Check
```bash
# Test health endpoint
curl https://your-worker.workers.dev/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-05T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 123.45
}
```

### 2. Authentication Test
```bash
# Test without API key (should fail)
curl https://your-worker.workers.dev/api/v1/users

# Test with valid API key (should succeed)
curl -H "X-API-Key: your_production_key" \
     https://your-worker.workers.dev/api/v1/users
```

### 3. Admin Functionality Test
```bash
# Test admin key info
curl -H "X-Admin-Secret: your_admin_secret" \
     https://your-worker.workers.dev/admin/keys/info
```

### 4. OpenAPI Documentation
Visit: `https://your-worker.workers.dev/ui`
- Verify all endpoints are documented
- Test authentication works in Swagger UI
- Verify example requests/responses

## Monitoring & Maintenance

### 1. Cloudflare Analytics
- Monitor request volume and patterns
- Track error rates and response times
- Set up alerts for high error rates

### 2. Logging Strategy
```typescript
// Enhanced logging for production
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration,
    userAgent: c.req.header('User-Agent'),
    ip: c.req.header('CF-Connecting-IP'),
    country: c.req.header('CF-IPCountry')
  }))
})
```

### 3. Health Monitoring
Set up external monitoring:
```bash
# Example monitoring script
curl -f https://your-worker.workers.dev/health || alert "API is down"
```

## Best Practices

### 1. API Key Management
- Rotate API keys regularly (quarterly)
- Use different keys for different clients/environments
- Monitor API key usage patterns
- Revoke unused or compromised keys immediately

### 2. Version Management
- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Maintain backward compatibility when possible
- Document breaking changes clearly
- Consider API versioning strategy (/api/v1/, /api/v2/)

### 3. Error Handling
- Never expose internal error details
- Use consistent error response format
- Log detailed errors server-side
- Provide helpful error messages to clients

### 4. Performance Optimization
```typescript
// Add response caching for read-only endpoints
app.get('/api/v1/users', async (c) => {
  c.header('Cache-Control', 'public, max-age=300') // 5 minutes
  // ...rest of handler
})
```

### 5. Database Best Practices (If Applicable)
- Use connection pooling
- Implement proper indexing
- Use prepared statements
- Regular backup strategy

## Troubleshooting

### Common Issues

**1. 401 Unauthorized Errors**
- Check API key format and validity
- Verify header names (X-API-Key vs Authorization)
- Check CORS configuration

**2. 500 Internal Server Errors**
- Check Cloudflare Worker logs
- Verify environment variables are set
- Check for unhandled promise rejections

**3. Rate Limiting Issues**
- Review rate limit configuration
- Check if legitimate traffic is being blocked
- Consider implementing user-specific rate limits

**4. CORS Issues**
- Verify origin whitelist
- Check preflight request handling
- Ensure all required headers are allowed

### Debugging Commands
```bash
# View logs
wrangler tail

# Check deployment status
wrangler whoami
wrangler deployments list

# Test locally before deploying
npm run dev
```

## Production Checklist

### Before Going Live
- [ ] All secrets configured in Cloudflare
- [ ] CORS configured for production domains
- [ ] Rate limiting appropriate for expected traffic
- [ ] Error responses don't leak sensitive information
- [ ] API documentation is complete and accurate
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery plan in place

### After Going Live
- [ ] Monitor error rates and response times
- [ ] Set up uptime monitoring
- [ ] Document API usage patterns
- [ ] Plan for scaling if needed
- [ ] Regular security reviews
- [ ] Keep dependencies updated

## Support and Maintenance

### Regular Tasks
- **Weekly**: Review error logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Rotate API keys and review security configuration
- **Annually**: Full security audit and performance review

### Emergency Contacts
- Cloudflare Support: [Support Portal](https://support.cloudflare.com)
- API Documentation: `https://your-worker.workers.dev/ui`
- Admin Interface: Use admin endpoints for key management

---

## 🎉 Congratulations!

Your CozySnippet API is now production-ready with:
- ✅ Secure authentication system
- ✅ Comprehensive error handling
- ✅ Rate limiting and security headers
- ✅ OpenAPI documentation
- ✅ Admin key management
- ✅ Monitoring and logging

Your API is ready to handle production traffic safely and efficiently!
