#!/bin/bash

# CozySnippet API - Production Setup Script
# Run this script to set up your production environment

set -e

echo "🚀 CozySnippet API - Production Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI not found. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    print_error "Not logged in to Cloudflare. Please login first:"
    echo "wrangler login"
    exit 1
fi

print_status "Wrangler CLI is ready"

# Step 1: Generate production API keys
echo ""
echo "📋 Step 1: Generate Production API Keys"
echo "======================================="
read -p "How many API keys do you want to generate? (default: 3): " key_count
key_count=${key_count:-3}

print_info "Generating $key_count production API keys..."
node scripts/generate-keys.js $key_count > production-keys.txt

print_status "API keys generated and saved to production-keys.txt"
print_warning "IMPORTANT: Save these keys securely and delete the file after setup!"

# Step 2: Generate admin secret
echo ""
echo "🔐 Step 2: Generate Admin Secret"
echo "================================"
print_info "Generating secure admin secret..."
node scripts/generate-admin-secret.js > admin-secret.txt

print_status "Admin secret generated and saved to admin-secret.txt"
print_warning "IMPORTANT: Save this secret securely and delete the file after setup!"

# Step 3: Set up Cloudflare secrets
echo ""
echo "🔑 Step 3: Set Up Cloudflare Secrets"
echo "===================================="
echo "Please set up the following secrets in Cloudflare Workers:"
echo ""
echo "1. API_KEYS (copy the comma-separated keys from production-keys.txt)"
echo "2. ADMIN_SECRET (copy from admin-secret.txt)"
echo ""
read -p "Press Enter to continue once you've set up the secrets..."

# Step 4: Validate deployment readiness
echo ""
echo "🔍 Step 4: Validate Deployment Readiness"
echo "========================================"

# Check if tests pass
print_info "Running tests..."
if npm test; then
    print_status "All tests passed"
else
    print_error "Tests failed. Please fix before deploying."
    exit 1
fi

# Check if code compiles
print_info "Checking TypeScript compilation..."
if npm run build; then
    print_status "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed. Please fix errors."
    exit 1
fi

# Check if linting passes
print_info "Running linter..."
if npm run lint; then
    print_status "Code linting passed"
else
    print_error "Linting failed. Please fix issues or run 'npm run lint:fix'"
    exit 1
fi

# Step 5: Deploy to staging first
echo ""
echo "🧪 Step 5: Deploy to Staging"
echo "============================"
read -p "Deploy to staging environment first? (y/N): " deploy_staging

if [[ $deploy_staging =~ ^[Yy]$ ]]; then
    print_info "Deploying to staging..."
    if npm run deploy:staging; then
        print_status "Staging deployment successful"
        echo "Staging URL: https://cozysnippet-api-staging.YOUR_SUBDOMAIN.workers.dev"
    else
        print_error "Staging deployment failed"
        exit 1
    fi
fi

# Step 6: Deploy to production
echo ""
echo "🚀 Step 6: Deploy to Production"
echo "==============================="
print_warning "This will deploy your API to production!"
read -p "Are you sure you want to deploy to production? (y/N): " deploy_prod

if [[ $deploy_prod =~ ^[Yy]$ ]]; then
    print_info "Deploying to production..."
    if npm run deploy:production; then
        print_status "Production deployment successful! 🎉"
        echo ""
        echo "🌐 Your API is now live at:"
        echo "   https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev"
        echo ""
        echo "📚 API Documentation:"
        echo "   https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev/ui"
        echo ""
        echo "🔍 Health Check:"
        echo "   https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev/health"
    else
        print_error "Production deployment failed"
        exit 1
    fi
else
    print_info "Production deployment skipped"
fi

# Step 7: Post-deployment verification
echo ""
echo "✅ Step 7: Post-Deployment Verification"
echo "======================================="

if [[ $deploy_prod =~ ^[Yy]$ ]]; then
    echo "Please verify your deployment:"
    echo ""
    echo "1. Health Check:"
    echo "   curl https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev/health"
    echo ""
    echo "2. Test API with authentication:"
    echo "   curl -H \"X-API-Key: YOUR_API_KEY\" \\"
    echo "        https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev/api/v1/users"
    echo ""
    echo "3. Test admin functionality:"
    echo "   curl -H \"X-Admin-Secret: YOUR_ADMIN_SECRET\" \\"
    echo "        https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev/admin/keys/info"
    echo ""
    echo "4. Visit API documentation:"
    echo "   https://cozysnippet-api-prod.YOUR_SUBDOMAIN.workers.dev/ui"
fi

# Cleanup
echo ""
echo "🧹 Cleanup"
echo "=========="
print_warning "Remember to securely store and then delete the generated key files:"
echo "- production-keys.txt"
echo "- admin-secret.txt"

echo ""
print_status "Production setup complete! 🎉"
echo ""
echo "📖 For ongoing maintenance, see PRODUCTION_GUIDE.md"
echo "🔧 Use 'npm run logs:production' to monitor your API"
