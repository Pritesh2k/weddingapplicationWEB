const { initializeApp, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

const serviceAccount = require('../service-account.json')

initializeApp({ credential: cert(serviceAccount) })

async function run() {
  // Set claim on YOUR existing account
  await getAuth().setCustomUserClaims('49WumlhQSCYxD9HQzHkaljvdXTG2', {
    role: 'authenticated'
  })
  console.log('✅ Role set for existing user')
  process.exit(0)
}

run().catch(console.error)