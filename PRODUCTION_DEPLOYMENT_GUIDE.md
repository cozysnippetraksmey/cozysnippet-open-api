# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Security Configuration
- [ ] Generate strong production API keys
- [ ] Generate strong admin secret
- [ ] Review CORS settings for production domains
- [ ] Enable rate limiting with appropriate limits
- [ ] Configure security headers

### 2. Environment Setup
- [ ] Create production wrangler configuration
- [ ] Set up environment variables
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and logging

### 3. Testing
- [ ] Run all tests: `npm test`
- [ ] Test API endpoints locally
- [ ] Validate OpenAPI documentation
- [ ] Test authentication flows

## Step-by-Step Deployment

### 1. Generate Production Credentials
```bash
# Generate secure API keys
npm run generate-keys

# Generate secure admin secret
npm run generate-admin-secret
```

### 2. Configure Production Environment
Create or update `wrangler.production.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "cozysnippet-api-prod",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-04",
  "env": "production",
  "vars": {
    "ENVIRONMENT": "production",
    "API_KEYS": "your_generated_production_keys_here",
    "ADMIN_SECRET": "your_generated_admin_secret_here"
  },
  "routes": [
    {
      "pattern": "api.yourdomain.com/*",
      "custom_domain": true
    }
  ]
}
```

### 3. Deploy to Production
```bash
# Safe deployment with all checks
npm run deploy:prod

# Or manual step-by-step
npm run lint
npm run test
npm run build
wrangler deploy --env production --minify
```

### 4. Verify Deployment
```bash
# Check deployment status
wrangler deployments list --env production

# Test health endpoint
curl https://your-api.workers.dev/health

# View logs
npm run logs:production
```

## Production Configuration

### Environment Variables
Set these in your production wrangler config or Cloudflare dashboard:

```bash
ENVIRONMENT=production
API_KEYS=cz_prod_abc123def456,cz_prod_xyz789uvw012
ADMIN_SECRET=admin_prod_super_secure_secret_change_immediately
```

### Security Headers
The production middleware automatically adds:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'`

### Rate Limiting
Production settings:
- Window: 15 minutes
- Max requests: 1000 per IP
- Automatic scaling based on load

### CORS Configuration
Update for your production domains:
```typescript
origin: [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://app.yourdomain.com'
]
```

## Monitoring & Maintenance

### Logging
```bash
# Real-time logs
wrangler tail --env production

# View specific time range
wrangler tail --env production --since 2025-10-04T00:00:00Z
```

### Analytics
Monitor in Cloudflare dashboard:
- Request volume
- Error rates
- Response times
- Geographic distribution

### Health Monitoring
Set up external monitoring for:
- `GET /health` - Should return 200
- Response time < 500ms
- Uptime > 99.9%

## Backup & Recovery

### Configuration Backup
```bash
# Backup current configuration
cp wrangler.production.jsonc backups/wrangler.$(date +%Y%m%d).jsonc

# Backup environment variables
wrangler secret list --env production > backups/secrets.$(date +%Y%m%d).txt
```

### Rollback Procedure
```bash
# List deployments
wrangler deployments list --env production

# Rollback to previous version
wrangler rollback --env production --deployment-id <previous-deployment-id>
```

## Scaling Considerations

### Performance Optimization
- Enable response caching for read-only endpoints
- Implement database connection pooling if using external DB
- Use Cloudflare KV for session storage
- Consider Cloudflare D1 for persistent data

### Traffic Management
- Configure auto-scaling policies
- Set up traffic routing rules
- Implement circuit breakers for external services
- Use Cloudflare's edge caching

## Security Best Practices

### API Key Management
- Rotate keys every 90 days
- Use different keys for different clients
- Implement key expiration dates
- Monitor key usage patterns

### Access Control
- Implement IP whitelisting for admin endpoints
- Use geo-blocking if needed
- Set up alerting for suspicious activity
- Regular security audits

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS only (automatic with Cloudflare)
- Implement request/response sanitization
- Log security events

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check environment variables are set correctly
   - Verify API key format and prefixes
   - Check header names (case-sensitive)

2. **CORS Errors**
   - Update allowed origins in production config
   - Check preflight request handling
   - Verify credentials setting

3. **Rate Limiting Issues**
   - Adjust limits for production traffic
   - Consider client-based limits
   - Implement retry logic with backoff

4. **Performance Issues**
   - Enable response caching
   - Optimize database queries
   - Use CDN for static assets

### Debug Commands
```bash
# Check worker status
wrangler whoami
wrangler deployments list --env production

# Test specific endpoints
curl -H "X-API-Key: your_key" https://your-api.workers.dev/api/v1/users

# Monitor real-time logs
wrangler tail --env production --format pretty
```

## Cost Optimization

### Request Optimization
- Implement efficient caching strategies
- Minimize external API calls
- Use bulk operations where possible
- Optimize response payload sizes

### Resource Management
- Monitor CPU usage and optimize hot paths
- Use appropriate memory limits
- Implement connection pooling
- Cache frequently accessed data

## Compliance & Documentation

### API Documentation
- Keep OpenAPI spec updated
- Document all endpoints and parameters
- Provide example requests/responses
- Include authentication requirements

### Change Management
- Version your API appropriately
- Maintain changelog
- Test backward compatibility
- Communicate breaking changes

### Compliance
- Implement proper logging for audit trails
- Follow data retention policies
- Ensure GDPR/CCPA compliance if applicable
- Regular security assessments

## Support & Maintenance

### Regular Tasks
- [ ] Weekly: Review logs and metrics
- [ ] Monthly: Rotate API keys
- [ ] Quarterly: Security audit
- [ ] Annually: Architecture review

### Emergency Contacts
- Development Team: [your-dev-team@company.com]
- Operations Team: [your-ops-team@company.com]
- Security Team: [your-security-team@company.com]

### Useful Links
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [OpenAPI Specification](https://swagger.io/specification/)
