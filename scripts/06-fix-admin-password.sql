-- Update or insert admin user with correct bcrypt hash for password 'admin123'
-- This hash was generated with bcrypt rounds=10
DELETE FROM users WHERE email = 'admin@titanautomaidstone.com';

INSERT INTO users (email, password_hash, role, created_at, updated_at)
VALUES ('admin@titanautomaidstone.com', '$2a$10$g3RwISHAr.zz9Nrw1MQy.OK9W6kQvKCLcRfJ5fA7Kw8vfbHDxiGqq', 'admin', NOW(), NOW());
