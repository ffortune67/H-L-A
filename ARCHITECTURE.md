# System Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                               │
│                    http://localhost:5173                            │
└─────────────────────────────────────────────────────────────────────┘
                                 ↑↓
                         HTTP/JSON Requests
                                 ↑↓
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Pages:                                                      │   │
│  │  - Home.tsx           - Blog.tsx                           │   │
│  │  - Services.tsx       - Projects.tsx                       │   │
│  │  - About.tsx          - Partners.tsx                       │   │
│  │  - Donations.tsx ⭐   - Contact.tsx                        │   │
│  │  - Downloads.tsx                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Components:                                                 │   │
│  │  - Layout.tsx         - Navigation                         │   │
│  │  - Forms              - Cards                              │   │
│  │  - Buttons            - Modals                             │   │
│  │  - etc...                                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  State Management:                                                  │
│  - localStorage (accessToken, refreshToken)                        │
│  - React hooks (useState, useContext)                              │
└─────────────────────────────────────────────────────────────────────┘
                                 ↑↓
                    HTTP/REST API Requests
              Authorization: Bearer {accessToken}
                                 ↑↓
┌─────────────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js/Node.js)                       │
│                    http://localhost:3000                            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Routes Layer:                                               │   │
│  │  /api/auth/*         → authRoutes.js                        │   │
│  │  /api/donations/*    → donationsRoutes.js                   │   │
│  │  /api/users/*        → usersRoutes.js                       │   │
│  │  /api/payments       → legacy endpoint (maps to donations)  │   │
│  │  /health             → server status                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                             ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Middleware Stack:                                           │   │
│  │  1. requestLogger      → Log all requests                   │   │
│  │  2. express.json()     → Parse JSON body                    │   │
│  │  3. cors()             → Allow frontend requests            │   │
│  │  4. corsHeaders        → Set CORS headers                   │   │
│  │  5. authenticateToken  → Verify JWT (for protected routes) │   │
│  │  6. errorHandler       → Global error handling              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                             ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Controllers:                                                │   │
│  │  - authController      → register, login, refresh, logout   │   │
│  │  - donationsController → create, read, update donations    │   │
│  │  - usersController     → profile, password, donation hist  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                             ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Services:                                                   │   │
│  │  - authService         → Password hashing (bcryptjs)        │   │
│  │                        → JWT generation & verification      │   │
│  │                        → Token refresh                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                             ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Database Layer:                                             │   │
│  │  - db.js               → PostgreSQL connection pool         │   │
│  │  - Parameterized queries → SQL injection prevention         │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 ↑↓
                         PostgreSQL Protocol
                                 ↑↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                          │
│                     localhost:5432/H-L-A                            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Tables:                                                     │   │
│  │                                                              │   │
│  │  users                 ← Store user accounts                │   │
│  │  ├─ id, email, password_hash                               │   │
│  │  ├─ first_name, last_name, phone, country                 │   │
│  │  ├─ organization, email_verified                           │   │
│  │  └─ created_at, updated_at, deleted_at (soft delete)      │   │
│  │                                                              │   │
│  │  contributions         ← Store donations                    │   │
│  │  ├─ id, user_id (FK to users)                              │   │
│  │  ├─ email, first_name, last_name, phone                   │   │
│  │  ├─ amount, currency, cause, frequency                    │   │
│  │  ├─ payment_method, status                                │   │
│  │  ├─ transaction_id, payment_processor                     │   │
│  │  └─ created_at, updated_at                                │   │
│  │                                                              │   │
│  │  refresh_tokens        ← Secure token storage              │   │
│  │  ├─ id, user_id (FK), token_hash                          │   │
│  │  ├─ expires_at, created_at                                │   │
│  │                                                              │   │
│  │  sessions              ← User session tracking             │   │
│  │  ├─ id, user_id (FK)                                       │   │
│  │  ├─ ip_address, user_agent                                │   │
│  │  ├─ created_at, expires_at                                │   │
│  │                                                              │   │
│  │  audit_logs            ← Complete audit trail              │   │
│  │  ├─ id, user_id (FK)                                       │   │
│  │  ├─ entity_type, entity_id, action                        │   │
│  │  ├─ old_values, new_values (JSONB)                        │   │
│  │  ├─ ip_address, created_at                                │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Performance Features:                                              │
│  - Indexes on email, created_at, status, user_id                  │
│  - Foreign key constraints                                         │
│  - Auto-increment primary keys                                     │
│  - Timestamp auto-update                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Sequence

```
┌─────────────┐                                      ┌─────────────┐
│  Frontend   │                                      │  Backend    │
│  (Browser)  │                                      │  (Express)  │
└─────┬───────┘                                      └──────┬──────┘
      │                                                     │
      │ 1. User enters email & password                   │
      ├─────────────────────────────────────────────────>│
      │    POST /api/auth/login                         │
      │    { email, password }                          │
      │                                                     │
      │                        2. Hash password match   │
      │                        3. Generate JWT tokens   │
      │                        4. Save refresh token    │
      │                                                     │
      │<─────────────────────────────────────────────────┤
      │    Response: { accessToken, refreshToken }     │
      │                                                     │
      │ 5. Store accessToken in localStorage           │
      │ 6. Store refreshToken in httpOnly cookie       │
      │                                                     │
      │ 7. User makes authenticated request            │
      ├─────────────────────────────────────────────────>│
      │    GET /api/users/me                           │
      │    Authorization: Bearer {accessToken}         │
      │                                                     │
      │                        8. Verify JWT signature │
      │                        9. Extract user info    │
      │                        10. Process request      │
      │                                                     │
      │<─────────────────────────────────────────────────┤
      │    Response: { user: {...} }                    │
      │                                                     │
      │ 11. AccessToken expires after 15 minutes       │
      │                                                     │
      │ 12. Make new request with expired token        │
      ├─────────────────────────────────────────────────>│
      │    GET /api/donations                          │
      │    Authorization: Bearer {expiredToken}        │
      │                                                     │
      │                        13. Token expired!      │
      │                        14. Return 401          │
      │                                                     │
      │<─────────────────────────────────────────────────┤
      │    Error: { message: "Token expired" }         │
      │                                                     │
      │ 15. Frontend calls refresh endpoint            │
      ├─────────────────────────────────────────────────>│
      │    POST /api/auth/refresh                      │
      │    { refreshToken }                            │
      │                                                     │
      │                        16. Verify refresh token│
      │                        17. Generate new access │
      │                                                     │
      │<─────────────────────────────────────────────────┤
      │    Response: { accessToken }                    │
      │                                                     │
      │ 18. Update localStorage with new token         │
      │ 19. Retry original request                     │
      ├─────────────────────────────────────────────────>│
      │    GET /api/donations                          │
      │    Authorization: Bearer {newAccessToken}      │
      │                                                     │
      │                        20. Request granted!    │
      │                                                     │
      │<─────────────────────────────────────────────────┤
      │    Response: { donations: [...] }              │
      │                                                     │
```

---

## Donation Creation Flow

```
┌──────────────┐                     ┌──────────────┐                ┌──────────────┐
│  User/Form   │                     │  Backend API │                │  Database    │
│  (Frontend)  │                     │  (Express)   │                │(PostgreSQL)  │
└──────┬───────┘                     └──────┬───────┘                └──────┬───────┘
       │                                     │                               │
       │ 1. Fill donation form              │                               │
       │    - Amount: 50                     │                               │
       │    - Cause: "general"               │                               │
       │    - Method: "card"                 │                               │
       │    - User info: name, email         │                               │
       │                                     │                               │
       │ 2. Click "Confirm donation"        │                               │
       ├────────────────────────────────────>│                               │
       │    POST /api/donations              │                               │
       │    { amount: 50, cause: ... }       │                               │
       │    Auth: Bearer {accessToken}       │                               │
       │                                     │                               │
       │                    3. Authenticate │                               │
       │                    4. Validate data│                               │
       │                    5. Prepare insert                               │
       │                                     ├──────────────────────────────>│
       │                                     │ INSERT INTO contributions    │
       │                                     │ (user_id, amount, cause...)  │
       │                                     │                              │
       │                                     │    6. Create record          │
       │                                     │    7. Return with ID=123     │
       │                                     │<──────────────────────────────┤
       │                                     │    Donation ID: 123          │
       │                                     │                              │
       │    Response (donation created)      │                              │
       │    { success: true,                 │                              │
       │      contribution: {                │                              │
       │        id: 123,                     │                              │
       │        amount: 50,                  │                              │
       │        status: "En attente"         │                              │
       │      }                              │                              │
       │    }                                │                              │
       │<────────────────────────────────────┤                              │
       │                                     │                              │
       │ 8. Display success message          │                              │
       │    "Donation created successfully"  │                              │
       │                                     │                              │
       │ 9. Show "Thank you" confirmation    │                              │
       │    Or payment instructions if bank  │                              │
       │    transfer was selected            │                              │
       │                                     │                              │
```

---

## Data Model Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         users                                │
│                                                              │
│  PK: id                                                      │
│  Unique: email                                              │
│  Columns: email, password_hash, first_name, last_name,    │
│           phone, country, organization, email_verified,    │
│           created_at, updated_at, deleted_at               │
└───────┬──────────────────────────────────────────────────────┘
        │
        │ 1:N relationship
        │
        ├──────────────────┬──────────────────┬──────────────────┐
        │                  │                  │                  │
        ▼                  ▼                  ▼                  ▼
┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ contributions   │ │ refresh_tokens   │ │    sessions      │ │  audit_logs      │
│                 │ │                  │ │                  │ │                  │
│ PK: id          │ │ PK: id           │ │ PK: id           │ │ PK: id           │
│ FK: user_id     │ │ FK: user_id      │ │ FK: user_id      │ │ FK: user_id      │
│                 │ │ Unique: token_ha │ │                  │ │                  │
│ Tracks:         │ │ sh               │ │ Tracks:          │ │ Tracks:          │
│ - Donations     │ │                  │ │ - IP address     │ │ - Entity type    │
│ - Amount        │ │ Expires after:   │ │ - User agent     │ │ - Action taken   │
│ - Cause         │ │ 7 days           │ │ - Session time   │ │ - Old values     │
│ - Status        │ │                  │ │                  │ │ - New values     │
│ - Payment info  │ │                  │ │                  │ │                  │
└─────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## Request/Response Examples

### Register Request
```http
POST /api/auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201 Created):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Donation Request
```http
POST /api/donations HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

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

Response (201 Created):
{
  "success": true,
  "message": "Contribution created successfully",
  "contribution": {
    "id": 123,
    "amount": 50,
    "cause": "general",
    "status": "En attente",
    "createdAt": "2024-05-15T10:30:00Z"
  }
}
```

### Protected Request (with JWT)
```http
GET /api/auth/me HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-05-15T10:00:00Z"
  }
}
```

---

## Error Response Example

```http
POST /api/donations HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "amount": -10,  // Invalid: negative
  "cause": "invalid_cause"  // Invalid cause
}

Response (400 Bad Request):
{
  "success": false,
  "message": "Invalid cause"
}
```

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Secure authentication
- ✅ Data persistence
- ✅ Scalability
- ✅ Maintainability
- ✅ Security best practices
