# Backend API Documentation

## Overview
REST API backend for the H-L-A (Humanitarian & Legal Aid) donation platform built with Node.js, Express, and PostgreSQL.

## Setup & Installation

### Prerequisites
- Node.js 14+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
```

3. **Initialize database:**
```bash
node init-db.js
```

This will:
- Create all tables (users, contributions, refresh_tokens, sessions, audit_logs)
- Create indexes for performance
- Insert sample data (demo@example.com / password123)

4. **Start the server:**
```bash
npm start
# or for development with hot reload
npm run dev
```

Server will run on `http://localhost:3000`

---

## API Endpoints

### Authentication (`/api/auth`)

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..." (also set as httpOnly cookie)
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "accessToken": "eyJhbGc..."
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+243999999999",
    "country": "DRC",
    "organization": "NGO Name",
    "createdAt": "2024-05-15T10:30:00Z"
  }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Donations (`/api/donations`)

#### Create Donation
```
POST /api/donations
Content-Type: application/json
Authorization: Bearer {accessToken} (optional, for linking to account)

{
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
}

Response (for card):
{
  "success": true,
  "message": "Contribution created successfully",
  "contribution": {
    "id": 1,
    "amount": 50,
    "cause": "general",
    "status": "En attente",
    "createdAt": "2024-05-15T10:30:00Z"
  }
}

Response (for bank transfer):
{
  "success": true,
  "type": "bank-transfer",
  "message": "Votre promesse de contribution a été enregistrée.",
  "instructions": "Veuillez effectuer votre virement pour le programme general.\nBanque: RAWBANK\nMotif: HLA-1",
  "id": 1
}
```

#### Get Donation by ID
```
GET /api/donations/{id}

Response:
{
  "success": true,
  "contribution": {
    "id": 1,
    "amount": 50,
    "currency": "USD",
    "cause": "general",
    "frequency": "unique",
    "payment_method": "card",
    "status": "En attente",
    "created_at": "2024-05-15T10:30:00Z"
  }
}
```

#### Get User Donations
```
GET /api/donations/user/contributions
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "contributions": [
    { ... },
    { ... }
  ]
}
```

#### Update Donation Status (Admin)
```
PUT /api/donations/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "Confirmé"
}

Response:
{
  "success": true,
  "contribution": { ... }
}
```

#### Get All Donations
```
GET /api/donations?status=Confirmé&cause=general&limit=50&offset=0

Response:
{
  "success": true,
  "contributions": [ ... ],
  "limit": 50,
  "offset": 0
}
```

---

### Users (`/api/users`)

#### Get User Profile
```
GET /api/users/{userId}
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+243999999999",
    "country": "DRC",
    "organization": "NGO Name",
    "emailVerified": false,
    "createdAt": "2024-05-15T10:30:00Z"
  }
}
```

#### Update User Profile
```
PUT /api/users/{userId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+243999999999",
  "country": "DRC",
  "organization": "NGO Name"
}

Response:
{
  "success": true,
  "user": { ... }
}
```

#### Get User Donation History
```
GET /api/users/{userId}/donations
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "donations": [
    { ... },
    { ... }
  ]
}
```

#### Change Password
```
POST /api/users/{userId}/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Delete User Account
```
DELETE /api/users/{userId}
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/H-L-A
DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=H-L-A

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE_IN=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key
REFRESH_TOKEN_EXPIRE_IN=7d

# Server
NODE_ENV=development
SERVER_PORT=3000
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Payment (Mobile Provider)
MOBILE_PROVIDER_URL=https://example.com/mobile-payments
MOBILE_PROVIDER_KEY=secret
```

---

## Valid Values

### Causes
- `general` (Don général)
- `education` (Éducation)
- `eau` (Eau potable)
- `sante` (Santé)
- `Ora Labora`
- `MC HAW`
- `Avocats Humanitaires`
- `Accès Humanitaire`
- `Évaluation`

### Frequencies
- `unique` (One-time)
- `mensuel` (Monthly)
- `annuel` (Yearly)

### Payment Methods
- `card` (Credit/Debit Card)
- `mobile` (Mobile Money)
- `virement` (Bank Transfer)

### Contribution Status
- `En attente` (Pending)
- `Confirmé` (Confirmed)
- `Annulé` (Cancelled)
- `Remboursé` (Refunded)

---

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional information (if applicable)"
}
```

Common HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Security

- All passwords are hashed using bcryptjs
- JWT tokens expire after 15 minutes
- Refresh tokens are stored as httpOnly cookies
- CORS is configured for the frontend URL
- SQL injection is prevented through parameterized queries
- Soft deletes preserve audit trail

---

## Database Schema

### users
- id (PK)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- phone
- country
- organization
- email_verified
- created_at
- updated_at
- deleted_at (soft delete)

### contributions
- id (PK)
- user_id (FK)
- email
- first_name
- last_name
- amount
- currency
- cause
- frequency
- payment_method
- status
- transaction_id
- payment_processor
- created_at
- updated_at

### refresh_tokens
- id (PK)
- user_id (FK)
- token_hash
- expires_at

### sessions
- id (PK)
- user_id (FK)
- ip_address
- user_agent
- created_at
- expires_at

### audit_logs
- id (PK)
- user_id (FK)
- entity_type
- entity_id
- action
- old_values
- new_values
- created_at

---

## Development

### Running Tests
```bash
npm test
```

### Database Cleanup
```bash
# Reset and reinitialize database
node init-db.js
```

### Logs
Logs are output to console. In production, configure a logging service.

---

## Support & Issues

For issues or questions, please contact the development team.
