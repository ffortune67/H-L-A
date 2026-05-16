# H-L-A Backend Configuration Guide

## Quick Start

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Database Setup

Make sure PostgreSQL is running, then initialize the database:
```bash
node init-db.js
```

This will:
- Create all database tables (users, contributions, refresh_tokens, sessions, audit_logs)
- Create indexes for performance optimization
- Insert sample data (demo@example.com / password123)

### 3. Configure Environment Variables

Edit `server/.env`:
```env
# Database Configuration
DB_USER=user
DB_PASSWORD=97F71m78@
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=H-L-A

# JWT Secrets (IMPORTANT: Change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-in-production-67890

# Server
NODE_ENV=development
SERVER_PORT=3000
CORS_ORIGIN=http://localhost:5173

# Payment (optional)
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Start the Backend Server
```bash
npm start
```

You should see:
```
✓ Server running on http://localhost:3000
✓ Environment: development
✓ CORS Origin: http://localhost:5173
✓ Database connected
```

### 5. Start the Frontend (in another terminal)
```bash
npm run dev
```

Frontend will run on http://localhost:5173

---

## Architecture Overview

### Backend Structure
```
server/
├── config/
│   ├── db.js              # PostgreSQL connection pool
│   └── database.sql       # Database schema & tables
├── controllers/
│   ├── authController.js  # Auth logic (register, login, refresh)
│   ├── donationsController.js  # Donation/contribution logic
│   └── usersController.js # User profile management
├── middleware/
│   └── authMiddleware.js  # JWT verification, error handling
├── routes/
│   ├── authRoutes.js      # /api/auth/* endpoints
│   ├── donationsRoutes.js # /api/donations/* endpoints
│   └── usersRoutes.js     # /api/users/* endpoints
├── services/
│   └── authService.js     # Password hashing, JWT generation
├── server.js              # Express app initialization
├── init-db.js             # Database initialization script
└── API_DOCUMENTATION.md   # Complete API reference
```

### Database Tables

#### users
- Stores user accounts
- Password hashing with bcryptjs
- Soft deletes support (deleted_at field)

#### contributions
- Donation records linked to users
- Tracks donation amount, cause, frequency, payment method
- Status tracking (En attente, Confirmé, Annulé, Remboursé)

#### refresh_tokens
- Secure token storage for JWT refresh mechanism
- Auto-expired tokens cleaned up

#### sessions
- User session tracking (IP, user agent)
- Session expiration

#### audit_logs
- Complete audit trail of all changes
- Tracks who changed what and when

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login & get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (requires token)

### Donations
- `POST /api/donations` - Create donation (public)
- `GET /api/donations/:id` - Get donation details
- `GET /api/donations/user/contributions` - Get user's donations (protected)
- `PUT /api/donations/:id` - Update status (protected)
- `GET /api/donations` - Get all donations (with filters)

### Users
- `GET /api/users/:id` - Get user profile (protected)
- `PUT /api/users/:id` - Update profile (protected)
- `DELETE /api/users/:id` - Delete account (protected)
- `GET /api/users/:id/donations` - Get donation history (protected)
- `POST /api/users/:id/change-password` - Change password (protected)

---

## Testing the API

### Using curl or Postman:

**1. Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**3. Create a donation:**
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "currency": "USD",
    "cause": "general",
    "frequency": "unique",
    "paymentMethod": "card",
    "customer": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "donor@example.com",
      "phone": "+243999999999"
    }
  }'
```

---

## Frontend Integration

The Donations page (`src/app/pages/Donations.tsx`) is already configured to:
1. Send donations to `http://localhost:3000/api/donations`
2. Map causes to backend values (general, education, eau, sante)
3. Handle different payment methods (card, mobile, virement)
4. Use authentication tokens from localStorage

The API endpoint `/api/payments` is automatically mapped to `/api/donations` for backward compatibility.

---

## Security Features

✓ **Password Security**: Bcryptjs hashing with salt
✓ **JWT Tokens**: 15-minute access tokens + 7-day refresh tokens
✓ **CORS**: Restricted to frontend origin
✓ **HTTP-Only Cookies**: Refresh tokens stored securely
✓ **SQL Injection Prevention**: Parameterized queries
✓ **Soft Deletes**: Data preservation for audit
✓ **Environment Variables**: Secrets not in code

---

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DB credentials in `.env` match your setup
- Ensure database exists: `CREATE DATABASE "H-L-A";`

### "Port 3000 already in use"
- Change `SERVER_PORT` in `.env`
- Or kill the existing process: `lsof -ti:3000 | xargs kill -9`

### "CORS error from frontend"
- Verify `CORS_ORIGIN` in `.env` matches frontend URL
- Default: `http://localhost:5173`

### API returning 401 Unauthorized
- Ensure accessToken is included in Authorization header
- Token format: `Authorization: Bearer {token}`
- Tokens expire after 15 minutes, use refresh endpoint

### Database initialization fails
- Make sure tables don't already exist (or drop old ones first)
- Check write permissions on PostgreSQL
- Review error message in console

---

## Next Steps

1. ✅ Backend running on :3000
2. ✅ Database configured with tables
3. ✅ Authentication working (JWT tokens)
4. ✅ Frontend can create donations
5. 🔄 Implement Stripe integration (optional)
6. 🔄 Add email notifications
7. 🔄 Set up production deployment

---

## Production Checklist

- [ ] Change JWT_SECRET and REFRESH_TOKEN_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS in production
- [ ] Enable email verification
- [ ] Set up payment processor (Stripe/Mobile provider)
- [ ] Configure backup strategy for database
- [ ] Set up monitoring and logging
- [ ] Add rate limiting
- [ ] Enable database encryption
- [ ] Set up SSL certificates

---

For more details, see `server/API_DOCUMENTATION.md`
