import bcrypt from 'bcryptjs'

async function generateHash() {
  const password = 'admin123'
  const hash = await bcrypt.hash(password, 10)
  console.log('Generated bcrypt hash for "admin123":')
  console.log(hash)
}

generateHash().catch(console.error)
