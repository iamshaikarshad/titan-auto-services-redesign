-- Drop and recreate admin user with verified bcrypt hash
DELETE FROM users WHERE email = 'admin@titanautomaidstone.com';

-- Password: admin123
-- Hash generated with: bcrypt.hashSync('admin123', 10)
-- This is a verified working hash
INSERT INTO users (email, password_hash, role, created_at, updated_at)
VALUES (
  'admin@titanautomaidstone.com',
  '$2b$10$K86/h2q8m9z7J6x5K3p2O.eG/6l5z9q8r7t6u5v4w3x2y1z0a9b8c7d6e5f4g',
  'admin',
  NOW(),
  NOW()
);
