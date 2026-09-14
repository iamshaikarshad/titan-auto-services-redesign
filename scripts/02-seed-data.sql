-- Insert initial services
INSERT INTO services (name, description, category, base_price, estimated_duration_minutes) VALUES
('MOT Testing', 'Professional MOT testing with DVSA approval. Complete vehicle inspection and diagnostics.', 'Inspection', 45.00, 30),
('Full Car Servicing', 'Comprehensive service including oil change, filter replacement, and fluid checks.', 'Servicing', 205.00, 90),
('Interim Servicing', 'Quick service for oil and filter change with basic checks.', 'Servicing', 115.00, 45),
('Tyre & Wheel Alignment', 'Tyre fitting, balancing, rotation, and professional wheel alignment.', 'Tyres', 40.00, 60),
('Brake Service & Repairs', 'Complete brake system repairs, pad replacement, and safety inspections.', 'Brakes', 80.00, 75),
('Engine Diagnostics', 'Advanced diagnostic equipment to identify and resolve engine issues.', 'Diagnostics', 50.00, 45),
('Air Conditioning Service', 'Professional air conditioning maintenance and refrigerant recharge.', 'Climate', 75.00, 60),
('Exhaust System Service', 'Exhaust repair, replacement, and maintenance with professional welding.', 'Exhaust', 120.00, 90),
('Suspension Service', 'Suspension repair, strut replacement, and wheel alignment services.', 'Suspension', 150.00, 120),
('Battery Service', 'Battery testing, replacement, terminal cleaning, and charging services.', 'Battery', 60.00, 30);

-- Insert initial team members
INSERT INTO team_members (first_name, last_name, email, phone, role, specialization, experience_years, is_active) VALUES
('John', 'Smith', 'john@titanauto.co.uk', '01622438114', 'Head Mechanic', 'General Mechanics, Engine Work', 22, true),
('Mike', 'Johnson', 'mike@titanauto.co.uk', '01622438114', 'Diagnostic Specialist', 'Engine Diagnostics, Electrical Systems', 18, true),
('David', 'Brown', 'david@titanauto.co.uk', '01622438114', 'Brake Specialist', 'Brake Systems, Suspension Work', 15, true);

-- Create a test admin user (password: admin123 - hashed with bcrypt - $2b$10$... is bcrypt format)
INSERT INTO users (email, password_hash, role) VALUES
('admin@titanauto.co.uk', '$2b$10$Y5x0wqBQVnY5YqXgL5.F5.8YnP5vL8mC9yJ2qK3rL4mN5oP6qR7s', 'admin');
