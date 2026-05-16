# H-L-A: Humanitarian & Legal Aid Platform

A complete web application for managing humanitarian donations with a React frontend and Node.js/Express backend.

## 📋 Project Overview

**Frontend:** React + Vite + TypeScript + Tailwind CSS
**Backend:** Node.js + Express + PostgreSQL
**Authentication:** JWT tokens with refresh mechanism
**Features:** User registration, donations, donation history, user profiles

### Key Characteristics
- Bilingual (English/French) donation forms
- Multiple payment methods (Card, Mobile Money, Bank Transfer)
- Donation categorization (Education, Health, Water, etc.)
- User authentication & profiles
- Donation history tracking
- Responsive design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- PostgreSQL 12+
- npm or yarn

### Installation

#### 1. Clone & Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

#### 2. Configure Environment
```bash
# Copy template to actual .env file
cp server/.env.example server/.env

# Edit server/.env with your database credentials:
# DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE
```

#### 3. Initialize Database
```bash
cd server
node init-db.js
```

This creates all tables and inserts demo data:
- **Demo account:** demo@example.com / password123

#### 4. Start Both Servers
```bash
# Terminal 1: Frontend (port 5173)
npm run dev

# Terminal 2: Backend (port 3000)
cd server
npm start
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** See `server/API_DOCUMENTATION.md`

---

## 📂 Project Structure

```
H-L-A/
├── src/                          # Frontend React app
│   ├── app/
│   │   ├── pages/               # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Donations.tsx   # ⭐ Main donation form
│   │   │   ├── Services.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── ...
│   │   ├── components/          # Reusable components
│   │   ├── routes.ts            # Route configuration
│   │   └── App.tsx              # App entry point
│   ├── main.tsx                 # React entry point
│   └── styles/                  # Global styles
│
├── server/                       # Backend Node.js/Express
│   ├── config/
│   │   ├── db.js               # PostgreSQL connection
│   │   └── database.sql        # Database schema
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── donationsController.js
│   │   └── usersController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT & error handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donationsRoutes.js
│   │   └── usersRoutes.js
│   ├── services/
│   │   └── authService.js      # Password & JWT utilities
│   ├── server.js               # Express app
│   ├── init-db.js              # Database initialization
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── API_DOCUMENTATION.md    # API reference
│
├── BACKEND_SETUP.md             # Backend setup guide
├── IMPLEMENTATION_SUMMARY.md    # What was implemented
├── VERIFICATION_CHECKLIST.md    # Verification checklist
├── package.json                 # Frontend dependencies
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
```

---

## 🔌 API Endpoints

### Authentication `/api/auth`
```
POST   /api/auth/register         Create new account
POST   /api/auth/login            Login & get tokens
POST   /api/auth/refresh          Refresh access token
POST   /api/auth/logout           Logout
GET    /api/auth/me               Get current user (protected)
```

### Donations `/api/donations`
```
POST   /api/donations             Create donation (public)
GET    /api/donations/:id         Get donation by ID
GET    /api/donations/user/contributions  User's donations (protected)
PUT    /api/donations/:id         Update status (protected)
GET    /api/donations             List all with filters
```

### Users `/api/users`
```
GET    /api/users/:id             Get profile (protected)
PUT    /api/users/:id             Update profile (protected)
DELETE /api/users/:id             Delete account (protected)
GET    /api/users/:id/donations   Donation history (protected)
POST   /api/users/:id/change-password  Change password (protected)
```

See `server/API_DOCUMENTATION.md` for detailed endpoint documentation.

---

## 🔐 Authentication

### How It Works
1. User registers or logs in
2. Backend returns JWT access token (15 min) + refresh token (7 days)
3. Frontend stores access token in localStorage
4. Each API request includes token in Authorization header
5. Token expires → frontend uses refresh token to get new access token

### Example
```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { accessToken, refreshToken } = await response.json();
localStorage.setItem('accessToken', accessToken);

// Authenticated request
fetch('http://localhost:3000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

---

## 💰 Donation Flow

### User Perspective
1. Navigate to `/donations` page
2. Select frequency (one-time/monthly)
3. Choose amount or enter custom amount
4. Select cause (Education, Health, Water, etc.)
5. Choose payment method (Card, Mobile Money, Bank Transfer)
6. Enter personal information
7. Confirm donation
8. See confirmation or payment instructions

### Backend Process
1. Receive POST /api/donations
2. Validate input data
3. Create contribution record in database
4. Return appropriate response:
   - For card/mobile: Ready for payment processing
   - For bank transfer: Show instructions with transfer reference
5. Optional: Link to user account if authenticated

---

## 🛠️ Development

### Frontend Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend Commands
```bash
cd server
npm start          # Start server
npm run dev        # Start with nodemon (if configured)
npm test           # Run tests
node init-db.js    # Initialize database
```

### Database Management
```bash
# Reinitialize database
cd server
node init-db.js

# Access PostgreSQL directly
psql -U user -d H-L-A -h localhost
```

---

## 📊 Database Schema

### Core Tables

**users**
- User accounts with bcryptjs hashed passwords
- Soft delete support (deleted_at field)
- Email verification tracking

**contributions**
- Donation records with full history
- Linked to users (if authenticated) or standalone
- Track status: pending, confirmed, cancelled, refunded

**refresh_tokens**
- Secure JWT refresh token storage
- Auto-expiration after 7 days

**sessions**
- User session tracking (IP, user agent)
- Session expiration management

**audit_logs**
- Complete audit trail of all changes
- Track what changed, by whom, and when

---

## 🔒 Security Features

✅ **Password Security**
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text

✅ **Token Security**
- JWT access tokens expire after 15 minutes
- Refresh tokens stored as httpOnly cookies
- Token validation on every protected request

✅ **SQL Security**
- Parameterized queries prevent SQL injection
- ORM-like patterns for database access

✅ **API Security**
- CORS configured for frontend origin only
- Request validation and sanitization
- Global error handling (no stack trace exposure)

✅ **Data Protection**
- Soft deletes preserve audit trail
- User data properly isolated
- Password change confirmation

---

## 🌍 Supported Values

### Donation Causes
- `general` - General donation
- `education` - Education programs
- `eau` - Clean water access
- `sante` - Health services
- `Ora Labora` - Ora Labora program
- `MC HAW` - MC HAW program
- `Avocats Humanitaires` - Humanitarian lawyers
- `Accès Humanitaire` - Humanitarian access
- `Évaluation` - Evaluation programs

### Donation Frequencies
- `unique` - One-time donation
- `mensuel` - Monthly donation
- `annuel` - Annual donation

### Payment Methods
- `card` - Credit/debit card
- `mobile` - Mobile money
- `virement` - Bank transfer

### Contribution Status
- `En attente` - Pending
- `Confirmé` - Confirmed
- `Annulé` - Cancelled
- `Remboursé` - Refunded

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | This file - project overview |
| `BACKEND_SETUP.md` | Installation & configuration guide |
| `IMPLEMENTATION_SUMMARY.md` | What was built |
| `VERIFICATION_CHECKLIST.md` | Implementation verification |
| `server/API_DOCUMENTATION.md` | Complete API reference |

---

## 🐛 Troubleshooting

### "Cannot connect to database"
**Solution:**
1. Ensure PostgreSQL is running
2. Check DB credentials in `server/.env`
3. Create database: `CREATE DATABASE "H-L-A";`

### "Port 3000 already in use"
**Solution:**
- Change `SERVER_PORT` in `server/.env`
- Or kill existing process: `lsof -ti:3000 | xargs kill -9`

### "CORS error from frontend"
**Solution:**
- Verify `CORS_ORIGIN` in `server/.env` is `http://localhost:5173`

### "401 Unauthorized" errors
**Solution:**
- Token expired → use refresh endpoint
- Token not sent → include Authorization header
- Token invalid → re-login to get new token

### API returns 500 error
**Solution:**
1. Check server console for error details
2. Verify database connection
3. Check request body matches schema
4. Look in `server/.env` for configuration issues

---

## 🚢 Production Deployment

### Before Going Live
- [ ] Change JWT_SECRET and REFRESH_TOKEN_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS/SSL certificates
- [ ] Configure production database
- [ ] Set CORS_ORIGIN to actual frontend domain
- [ ] Enable email verification
- [ ] Implement payment processor (Stripe/etc)
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Enable rate limiting

### Deployment Options
- Heroku (easy setup)
- AWS (EC2/Elastic Beanstalk)
- DigitalOcean (simple & affordable)
- Docker + Kubernetes (enterprise)

---

## 📝 License

This project is part of the H-L-A (Humanitarian & Legal Aid) initiative.

---

## 👥 Support & Contributing

For issues, questions, or contributions:
1. Check documentation files first
2. Review `server/API_DOCUMENTATION.md`
3. Check browser console for frontend errors
4. Check server console for backend errors
5. Review `.env` configuration

---

## 🎯 Project Status

✅ **Frontend** - Complete with donation form, pages, and routing
✅ **Backend API** - Complete with auth, donations, users endpoints
✅ **Database** - PostgreSQL schema with all tables
✅ **Authentication** - JWT tokens with refresh mechanism
✅ **Frontend-Backend Integration** - Donations page connected
✅ **Documentation** - Complete API and setup guides

### Ready for:
✅ Development & testing
✅ Local deployment
✅ Feature additions
⏳ Production deployment (with configuration)

---

**Last Updated:** May 15, 2024
**Version:** 1.0.0
**Status:** Ready for Development 🚀
  