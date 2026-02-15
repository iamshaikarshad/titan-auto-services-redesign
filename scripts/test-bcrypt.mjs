import bcrypt from 'bcryptjs'

async function testBcrypt() {
  const password = 'admin123'
  const rounds = 10

  // Generate hash
  const hash = await bcrypt.hash(password, rounds)
  console.log('Generated hash:', hash)

  // Test comparison
  const isValid = await bcrypt.compare(password, hash)
  console.log('Password matches:', isValid)

  // Test with known hash formats
  const testHashes = [
    '$2b$10$K86/h2q8m9z7J6x5K3p2O.eG/6l5z9q8r7t6u5v4w3x2y1z0a9b8c7d6e5f4g',
    '$2a$10$g3RwISHAr.zz9Nrw1MQy.OK9W6kQvKCLcRfJ5fA7Kw8vfbHDxiGqq',
  ]

  for (const hash of testHashes) {
    try {
      const result = await bcrypt.compare(password, hash)
      console.log(`Hash ${hash.substring(0, 20)}... matches: ${result}`)
    } catch (e) {
      console.log(`Hash ${hash.substring(0, 20)}... error: ${e.message}`)
    }
  }
}

testBcrypt().catch(console.error)
