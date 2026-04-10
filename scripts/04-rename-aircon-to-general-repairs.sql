-- Rename "Air Conditioning Service" to "General Repairs" in the services table
UPDATE services 
SET name = 'General Repairs',
    description = 'Professional general repairs for all makes and models. From minor fixes to major repairs, we handle it all.',
    base_price = 40.00,
    updated_at = NOW()
WHERE name = 'Air Conditioning Service';
