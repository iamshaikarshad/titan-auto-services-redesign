-- Add password reset fields to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
