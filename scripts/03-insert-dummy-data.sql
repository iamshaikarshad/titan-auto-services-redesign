-- Insert dummy customers
INSERT INTO customers (first_name, last_name, email, phone, car_make, car_model, car_year, registration_number, address, city, postal_code, notes, created_at, updated_at)
VALUES 
  ('James', 'Wilson', 'james.wilson@email.com', '07700123456', 'Toyota', 'Corolla', 2020, 'AB20JWL', '42 High Street', 'Maidstone', 'ME15 6QT', 'Loyal customer', NOW(), NOW()),
  ('Emma', 'Johnson', 'emma.j@email.com', '07712345678', 'Ford', 'Focus', 2019, 'CD19EMJ', '15 Park Lane', 'Maidstone', 'ME15 7RX', 'Prefers morning appointments', NOW(), NOW()),
  ('Robert', 'Smith', 'rob.smith@email.com', '07723456789', 'BMW', '3 Series', 2021, 'EF21RMS', '88 North Road', 'Maidstone', 'ME15 8QX', 'Premium service customer', NOW(), NOW()),
  ('Sophie', 'Taylor', 'sophie.t@email.com', '07734567890', 'Volkswagen', 'Golf', 2018, 'GH18STL', '23 Church Road', 'Maidstone', 'ME15 9QY', 'Regular maintenance', NOW(), NOW()),
  ('Michael', 'Brown', 'michael.b@email.com', '07745678901', 'Honda', 'Civic', 2020, 'IJ20MBR', '56 School Lane', 'Maidstone', 'ME15 8QZ', 'Fleet vehicle', NOW(), NOW());

-- Insert dummy bookings
INSERT INTO bookings (customer_id, service_id, booking_date, assigned_technician_id, status, total_price, notes, created_at, updated_at)
VALUES 
  (1, 1, '2026-02-20 10:00:00', 1, 'confirmed', 45.00, 'MOT test', NOW(), NOW()),
  (2, 2, '2026-02-21 14:00:00', 2, 'confirmed', 150.00, 'Full service', NOW(), NOW()),
  (3, 3, '2026-02-22 09:30:00', 3, 'pending', 60.00, 'Tyre fitting and balancing', NOW(), NOW()),
  (4, 4, '2026-02-23 11:00:00', 1, 'confirmed', 120.00, 'Brake pad replacement', NOW(), NOW()),
  (5, 5, '2026-02-24 15:30:00', 2, 'pending', 75.00, 'Engine diagnostics and repair', NOW(), NOW()),
  (1, 6, '2026-02-25 10:00:00', 3, 'completed', 85.00, 'Air con recharge', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  (2, 7, '2026-02-26 13:00:00', 1, 'confirmed', 180.00, 'Exhaust system repair', NOW(), NOW()),
  (3, 8, '2026-02-27 09:00:00', 2, 'pending', 200.00, 'Suspension service', NOW(), NOW());
