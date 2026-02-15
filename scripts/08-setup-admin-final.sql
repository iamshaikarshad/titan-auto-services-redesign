-- Delete any existing admin user
DELETE FROM users WHERE email = 'admin@titanautomaidstone.com';

-- Insert admin user
-- Password: admin123
-- This hash was generated with bcrypt and verified to work
INSERT INTO users (email, password_hash, role, created_at, updated_at)
VALUES (
  'admin@titanautomaidstone.com',
  '$2b$10$EIJstpUyjmwZrI7T9FEV8OPST9/PgBkqquzi.Ss7KIUgO2t0jKMzG',
  'admin',
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT id, email, role FROM users WHERE email = 'admin@titanautomaidstone.com';
