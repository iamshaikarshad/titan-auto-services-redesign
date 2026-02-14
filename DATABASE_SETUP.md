# Database Integration Summary

Your Titan Auto garage website is now connected to Neon PostgreSQL with a complete booking system.

## Database Tables Created

### 1. **users** - Admin/Staff Accounts
- id, email, password_hash, name, role, created_at, updated_at

### 2. **customers** - Customer Information
- id, name, email, phone, vehicle, created_at, updated_at

### 3. **services** - Available Services
- id, name, description, price, created_at, updated_at
- Pre-populated with: MOT Testing, Car Servicing, Tyres & Alignment, Brake Service, Engine Diagnostics, Air Con Service, Exhaust Service, Suspension Service, Battery Service

### 4. **team_members** - Garage Staff
- id, name, role, email, phone, experience_years, created_at
- Pre-populated with: John Smith (Owner), Mike Johnson (Diagnostic Specialist), David Brown (Brake & Suspension Specialist)

### 5. **bookings** - Customer Appointments
- id, customer_id, service_id, booking_date, booking_time, notes, status, created_at
- Status can be: pending, confirmed, completed, cancelled

## API Endpoints

### POST /api/bookings
**Create a new booking**
- Request body: `{ service, date, time, name, email, phone, vehicle, notes }`
- Response: `{ success, bookingId, message }`
- Features:
  - Validates all required fields
  - Creates/updates customer if needed
  - Stores booking with pending status
  - Transaction-based for data integrity

### GET /api/bookings
**Retrieve bookings**
- Query params: `?customerId=xxx` (optional)
- Response: `{ success, count, bookings }`

### GET /api/services
**Retrieve all available services**
- Response: `{ success, services: [] }`
- Returns: id, name, description, price

## How Bookings Work

1. **Customer submits booking form** → POST /api/bookings
2. **API checks if customer exists in database**
   - If exists: Update customer info
   - If new: Create new customer record
3. **Booking is saved** with `pending` status
4. **Confirmation page shows** booking details
5. **Deposit payment** can be collected via Stripe (already integrated)

## Environment Variables

Make sure these are set in your Vercel project:
- `DATABASE_URL` - Neon PostgreSQL connection string (automatically added when you connected Neon)

## Next Steps

You can now:
1. Create an admin dashboard to manage bookings
2. Add email notifications when bookings are created
3. Build customer login to view their booking history
4. Create team scheduling system
5. Add booking status updates

## Test Data

- **Admin User**: admin@titanautomaidstone.com (test account)
- **Services**: 9 pre-populated services with prices
- **Team Members**: 3 team members ready to be assigned to bookings
