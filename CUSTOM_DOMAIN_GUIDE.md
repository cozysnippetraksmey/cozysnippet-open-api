# Custom Domain Setup Guide for CozySnippet API

## Overview
Setting up a custom domain for your Cloudflare Workers API makes it more professional and easier to remember. Instead of `cozysnippet-api-prod.raksmeykoung.workers.dev`, you can use something like `api.yourdomain.com`.

## Prerequisites
- A domain name (you own or can purchase)
- Domain added to Cloudflare (free plan works)
- Cloudflare Workers deployment (✅ already done)

## Setup Options

### Option 1: Use an Existing Domain (Recommended)
If you already own a domain and it's managed by Cloudflare:

1. **Add Domain to Cloudflare** (if not already added)
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Click "Add a Site"
   - Enter your domain name
   - Choose the free plan
   - Update your domain's nameservers to Cloudflare's

2. **Set up Custom Domain via Dashboard**
   - Go to Workers & Pages > Your Worker
   - Click "Settings" tab
   - Click "Domains & Routes"
   - Click "Add Custom Domain"
   - Enter your subdomain (e.g., `api.yourdomain.com`)

### Option 2: Purchase a New Domain
If you need a new domain:

1. **Purchase through Cloudflare Registrar** (recommended)
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to "Domain Registration"
   - Search and purchase your domain
   - It will automatically be added to your account

2. **Or purchase elsewhere and transfer DNS**
   - Buy domain from any registrar
   - Add it to Cloudflare as described in Option 1

## Configuration Steps

### 1. Choose Your Custom Domain Structure

**Recommended patterns:**
- `api.yourdomain.com` - Clean and professional
- `cozysnippet.yourdomain.com` - Branded subdomain
- `v1.api.yourdomain.com` - Version-specific

### 2. Update Your Worker Configuration

I'll show you how to configure this in your `wrangler.jsonc` file.

### 3. Deploy with Custom Domain

Once configured, your API will be available at your custom domain with automatic SSL certificates.

## Benefits of Custom Domains

✅ **Professional Appearance**: `api.yourdomain.com` vs `worker-name.account.workers.dev`
✅ **Branding**: Your domain, your brand
✅ **SSL Certificates**: Automatic HTTPS with Cloudflare's SSL
✅ **Better SEO**: Custom domains rank better
✅ **Easier to Remember**: Shorter, more meaningful URLs
✅ **Independence**: Not tied to Cloudflare's subdomain structure

## Example Custom Domain URLs

**Before (current):**
- Development: `https://cozysnippet-open-api.raksmeykoung.workers.dev`
- Production: `https://cozysnippet-api-prod.raksmeykoung.workers.dev`

**After (with custom domain):**
- Development: `https://api-dev.yourdomain.com`
- Production: `https://api.yourdomain.com`

## Manual Setup via Cloudflare Dashboard

Since wrangler CLI doesn't have the custom domain commands in your version, here's how to set it up manually:

### Step 1: Go to Cloudflare Dashboard
1. Visit [dash.cloudflare.com](https://dash.cloudflare.com)
2. Log in with your account (raksmeykoung@gmail.com)

### Step 2: Navigate to Workers
1. Click "Workers & Pages" in the left sidebar
2. Find your worker: `cozysnippet-api-prod`
3. Click on it to open worker details

### Step 3: Add Custom Domain
1. Click the "Settings" tab
2. Click "Triggers" (or "Custom Domains")
3. Click "Add Custom Domain"
4. Enter your desired subdomain (e.g., `api.yourdomain.com`)
5. Click "Add Custom Domain"

### Step 4: DNS Configuration
Cloudflare will automatically:
- Create the necessary DNS records
- Generate SSL certificates
- Route traffic to your Worker

## Domain Suggestions

If you need to purchase a domain, here are some suggestions:

**For API/Development:**
- `yourname-api.com`
- `cozysnippet.com`
- `yourname-dev.com`

**For Personal Brand:**
- `yourname.dev`
- `yourname.io`
- `yourname.com`

## Cost Considerations

**Free Options:**
- Using Cloudflare's free plan with any domain
- Subdomains of existing domains you own

**Paid Options:**
- New domain registration: ~$10-15/year
- Cloudflare Registrar: Often cheaper than other registrars

## What Domain Do You Have?

To help you set this up, I need to know:

1. **Do you already own a domain name?** If yes, what is it?
2. **Is your domain already on Cloudflare?** 
3. **What subdomain would you like for your API?** (e.g., `api`, `cozysnippet`, `v1`)

Once you provide this information, I can update your worker configuration and give you specific instructions for your setup.

## Next Steps

1. **Choose/Add your domain to Cloudflare**
2. **Decide on your API subdomain structure**
3. **Update worker configuration**
4. **Deploy with custom domain**
5. **Test the new custom domain**

Let me know your domain details and I'll help you configure everything!
