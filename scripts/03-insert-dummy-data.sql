-- First, check for existing customers and insert new ones only if needed
INSERT INTO customers (first_name, last_name, email, phone, car_make, car_model, car_year, registration_number, address, city, postal_code, notes, created_at, updated_at)
VALUES 
  ('James', 'Wilson', 'james.wilson@email.com', '07700123456', 'Toyota', 'Corolla', 2020, 'AB20JWL', '42 High Street', 'Maidstone', 'ME15 6QT', 'Loyal customer', NOW(), NOW()),
  ('Emma', 'Johnson', 'emma.j@email.com', '07712345678', 'Ford', 'Focus', 2019, 'CD19EMJ', '15 Park Lane', 'Maidstone', 'ME15 7RX', 'Prefers morning appointments', NOW(), NOW()),
  ('Robert', 'Smith', 'rob.smith@email.com', '07723456789', 'BMW', '3 Series', 2021, 'EF21RMS', '88 North Road', 'Maidstone', 'ME15 8QX', 'Premium service customer', NOW(), NOW()),
  ('Sophie', 'Taylor', 'sophie.t@email.com', '07734567890', 'Volkswagen', 'Golf', 2018, 'GH18STL', '23 Church Road', 'Maidstone', 'ME15 9QY', 'Regular maintenance', NOW(), NOW()),
  ('Michael', 'Brown', 'michael.b@email.com', '07745678901', 'Honda', 'Civic', 2020, 'IJ20MBR', '56 School Lane', 'Maidstone', 'ME15 8QZ', 'Fleet vehicle', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert dummy bookings using customer IDs from database
INSERT INTO bookings (customer_id, service_id, booking_date, assigned_technician_id, status, total_price, notes, created_at, updated_at)
SELECT 
  c.id,
  data.service_id,
  data.booking_date,
  data.assigned_technician_id,
  data.status,
  data.total_price,
  data.notes,
  NOW(),
  NOW()
FROM (
  VALUES 
    ('james.wilson@email.com'::text, 1, '2026-02-20 10:00:00'::timestamp, 1::integer, 'pending'::text, 45.00::numeric, 'MOT test'::text),
    ('emma.j@email.com'::text, 2, '2026-02-21 14:00:00'::timestamp, 2::integer, 'pending'::text, 150.00::numeric, 'Full service'::text),
    ('rob.smith@email.com'::text, 3, '2026-02-22 09:30:00'::timestamp, 3::integer, 'pending'::text, 60.00::numeric, 'Tyre fitting'::text),
    ('sophie.t@email.com'::text, 4, '2026-02-23 11:00:00'::timestamp, 1::integer, 'pending'::text, 120.00::numeric, 'Brake service'::text),
    ('michael.b@email.com'::text, 5, '2026-02-24 15:30:00'::timestamp, 2::integer, 'pending'::text, 75.00::numeric, 'Diagnostics'::text),
    ('james.wilson@email.com'::text, 6, '2026-02-18 10:00:00'::timestamp, 3::integer, 'completed'::text, 85.00::numeric, 'Air con recharge'::text),
    ('emma.j@email.com'::text, 7, '2026-02-26 13:00:00'::timestamp, 1::integer, 'pending'::text, 180.00::numeric, 'Exhaust repair'::text),
    ('rob.smith@email.com'::text, 8, '2026-02-27 09:00:00'::timestamp, 2::integer, 'pending'::text, 200.00::numeric, 'Suspension'::text)
) AS data(email, service_id, booking_date, assigned_technician_id, status, total_price, notes)
JOIN customers c ON c.email = data.email;
