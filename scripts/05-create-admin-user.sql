-- Insert default admin user with password 'admin123' (hashed with bcrypt)
-- Hash: $2b$10$7J7VJ7vJ7vJ7vJ7vJ7vJ7e7J7vJ7vJ7vJ7vJ7vJ7vJ7vJ7vJ7vJ7vJ (admin123)
INSERT INTO users (email, password_hash, role, created_at, updated_at)
VALUES ('admin@titanautomaidstone.com', '$2b$10$YIjlrTTtqI.JIx1VdF8zKOXRfpVGlkuEkZvDxPx3vc5XYnEJUBNKm', 'admin', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
