-- Create tables for auto garage booking system

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  car_make VARCHAR(100),
  car_model VARCHAR(100),
  car_year INTEGER,
  car_license_plate VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  special_notes TEXT,
  deposit_paid BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10, 2),
  stripe_payment_intent_id VARCHAR(255),
  confirmation_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_date, booking_time)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  google_review_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Operating hours table
CREATE TABLE IF NOT EXISTS operating_hours (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

-- Insert default services
INSERT INTO services (name, description, price, duration_minutes, category) VALUES
  ('Oil Change', 'Full synthetic or conventional oil change with filter replacement', 49.99, 30, 'Maintenance'),
  ('Brake Service', 'Brake pad replacement, rotor resurfacing, and system inspection', 189.99, 60, 'Brakes'),
  ('Tire Rotation', 'Rotate and balance all four tires for even wear', 39.99, 30, 'Tires'),
  ('Engine Diagnostic', 'Computer diagnostic to identify engine issues', 79.99, 45, 'Diagnostics'),
  ('Transmission Fluid Service', 'Drain and refill transmission fluid with filter replacement', 149.99, 60, 'Transmission'),
  ('Battery Replacement', 'Remove old battery and install new one with testing', 99.99, 30, 'Electrical'),
  ('Wheel Alignment', 'Professional 4-wheel alignment for proper handling', 119.99, 60, 'Suspension'),
  ('AC Service', 'Refrigerant recharge and system inspection', 89.99, 45, 'Climate Control')
ON CONFLICT DO NOTHING;

-- Insert default operating hours (Monday-Friday 8am-6pm, Saturday 9am-4pm, Sunday closed)
INSERT INTO operating_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, NULL, NULL, true),  -- Sunday closed
  (1, '08:00', '18:00', false),  -- Monday
  (2, '08:00', '18:00', false),  -- Tuesday
  (3, '08:00', '18:00', false),  -- Wednesday
  (4, '08:00', '18:00', false),  -- Thursday
  (5, '08:00', '18:00', false),  -- Friday
  (6, '09:00', '16:00', false)   -- Saturday
ON CONFLICT DO NOTHING;
