# Admin Authentication Setup

## Environment Variables

Add the following environment variable in the **Vars** section of the sidebar:

```
ADMIN_PASSWORD=your_secure_password_here
```

**Default value** (if not set): `admin123`

## How It Works

1. **Login Page**: Navigate to `/admin/login` and enter your admin password
2. **Authentication**: The system uses HTTP-only cookies to maintain secure sessions
3. **Session Duration**: Sessions expire after 24 hours
4. **Protection**: The middleware automatically redirects unauthenticated users to the login page

## Access Points

- **Admin Dashboard**: `/admin` (protected - requires authentication)
- **Admin Login**: `/admin/login` (public - login page)
- **API Endpoints**:
  - `POST /api/admin/login` - Login endpoint
  - `POST /api/admin/logout` - Logout endpoint
  - `GET /api/admin/bookings` - Fetch bookings (protected)
  - `PUT /api/admin/bookings` - Update booking status (protected)

## Security Features

✓ HTTP-only cookies (cannot be accessed via JavaScript)
✓ Secure flag (HTTPS only in production)
✓ SameSite protection against CSRF attacks
✓ Middleware-based route protection
✓ Session expiration after 24 hours
✓ Automatic redirect to login for unauthorized access
