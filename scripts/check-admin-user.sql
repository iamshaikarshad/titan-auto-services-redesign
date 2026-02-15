SELECT id, email, role, password_hash, LENGTH(password_hash) as hash_length 
FROM users 
WHERE email = 'admin@titanautomaidstone.com' OR role = 'admin';
