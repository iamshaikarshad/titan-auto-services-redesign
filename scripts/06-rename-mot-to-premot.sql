-- Update MOT Testing service name to PreMOT in the services table
UPDATE services 
SET name = 'PreMOT', 
    description = 'Professional pre-MOT vehicle inspection to identify potential issues before your official MOT test.'
WHERE name = 'MOT Testing';
