/**
 * Admin Secret Generator
 * Generate a secure admin secret for managing API keys
 */

function generateAdminSecret() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = 'admin_'

  for (let i = 0; i < 48; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

console.log('🔐 Generating secure admin secret for CozySnippet API\n')

const adminSecret = generateAdminSecret()
console.log(`Admin Secret: ${adminSecret}`)

console.log('\n📋 Setup Instructions:')
console.log('For Production (Cloudflare):')
console.log('  wrangler secret put ADMIN_SECRET')
console.log(`  # Enter: ${adminSecret}`)

console.log('\nFor Local Development:')
console.log('  Update wrangler.jsonc vars.ADMIN_SECRET with your secret')

console.log('\n🔧 Usage Examples:')
console.log('Generate new API keys:')
console.log(`  curl -X POST -H "X-Admin-Secret: ${adminSecret}" \\`)
console.log('    -H "Content-Type: application/json" \\')
console.log('    -d \'{"count": 3}\' \\')
console.log('    https://your-api.workers.dev/admin/keys/generate')

console.log('\nCheck current keys info:')
console.log(`  curl -H "X-Admin-Secret: ${adminSecret}" \\`)
console.log('    https://your-api.workers.dev/admin/keys/info')

console.log('\n⚠️  IMPORTANT: Keep this admin secret secure and private!')
console.log('   It allows full control over your API key management.')
