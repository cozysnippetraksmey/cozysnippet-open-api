/**
 * Simple API Key Generator
 * Generate secure API keys for your CozySnippet API
 */

function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const prefix= 'cz_'
  let result = prefix

  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

function generateMultipleKeys(count = 1) {
  console.log('🔑 Generating secure API keys for CozySnippet API\n')

  const keys = []
  for (let i = 1; i <= count; i++) {
    const apiKey = generateApiKey()
    keys.push(apiKey)
    console.log(`Key ${i}: ${apiKey}`)
  }

  console.log('\n📋 Setup Instructions:')
  console.log('For Production (Cloudflare):')
  console.log('  wrangler secret put API_KEYS')
  console.log(`  # Enter: ${keys.join(',')}`)
  console.log('\nFor Local Development:')
  console.log('  Update wrangler.jsonc vars.API_KEYS with your keys')
  console.log('\nClient Usage:')
  console.log('  curl -H "X-API-Key: YOUR_KEY" https://your-api.workers.dev/api/v1/users')
  console.log('  # OR')
  console.log('  curl -H "Authorization: Bearer YOUR_KEY" https://your-api.workers.dev/api/v1/users')
}

// Get number of keys from command line
const keyCount = parseInt(process.argv[2]) || 1
generateMultipleKeys(keyCount)
