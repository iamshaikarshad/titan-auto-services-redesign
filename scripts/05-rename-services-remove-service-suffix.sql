-- Update service names to remove "Service" suffix
UPDATE services SET name = 'Exhaust System' WHERE name = 'Exhaust System Service';
UPDATE services SET name = 'Suspension' WHERE name = 'Suspension Service';
UPDATE services SET name = 'Battery' WHERE name = 'Battery Service';
