import bcrypt from 'bcryptjs'
import { Pool } from '@neondatabase/serverless'

const password = 'admin123'
const email = 'admin@titanautomaidstone.com'

async function setupAdmin() {
  try {
    console.log('[v0] Generating bcrypt hash for password:', password)
    
    // Generate hash with 10 rounds
    const hash = await bcrypt.hash(password, 10)
    console.log('[v0] Generated hash:', hash)
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash)
    console.log('[v0] Hash verification result:', isValid)
    
    if (!isValid) {
      throw new Error('Generated hash does not match password')
    }
    
    // Connect to database
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const client = await pool.connect()
    
    try {
      // Delete existing admin user
      await client.query('DELETE FROM users WHERE email = $1', [email])
      console.log('[v0] Deleted existing user')
      
      // Insert new admin user with verified hash
      const result = await client.query(
        'INSERT INTO users (email, password_hash, role, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, email, role',
        [email, hash, 'admin']
      )
      
      console.log('[v0] Admin user created successfully:', result.rows[0])
      console.log('[v0] Setup complete!')
      console.log('[v0] Login credentials:')
      console.log('[v0]   Email:', email)
      console.log('[v0]   Password:', password)
      console.log('[v0]   Bcrypt Hash:', hash)
      
    } finally {
      client.release()
      pool.end()
    }
    
  } catch (error) {
    console.error('[v0] Setup error:', error)
    process.exit(1)
  }
}

setupAdmin()
