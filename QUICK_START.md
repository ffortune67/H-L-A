# ⚡ 5-Minute Quick Start Guide

## Start the H-L-A Donation Platform in 5 Minutes

### Prerequisites
- ✅ Node.js installed
- ✅ PostgreSQL running on localhost:5432
- ✅ Database exists: `H-L-A`

---

## Step 1: Install Backend (1 minute)

```bash
cd server
npm install
```

---

## Step 2: Initialize Database (1 minute)

```bash
node init-db.js
```

**Output will show:**
```
✓ Database initialized successfully!
Sample credentials:
  Email: demo@example.com
  Password: password123
```

---

## Step 3: Start Backend (30 seconds)

Keep this terminal open:

```bash
npm start
```

**You'll see:**
```
✓ Server running on http://localhost:3000
✓ Environment: development
✓ CORS Origin: http://localhost:5173
✓ Database connected
```

---

## Step 4: Start Frontend (30 seconds)

Open a NEW terminal:

```bash
npm run dev
```

**You'll see:**
```
➜  Local:   http://localhost:5173/
```

---

## Step 5: Test It (1 minute)

### Option A: Test Login
1. Open browser: http://localhost:5173/donations
2. Scroll to "Step 3: Sign In" (if you need to log in)
3. Click "Se connecter"
4. Use credentials:
   - Email: `demo@example.com`
   - Password: `password123`

### Option B: Test Donation (Anonymous)
1. Open http://localhost:5173/donations
2. Select amount: $50
3. Select cause: Education (Éducation)
4. Select payment: Card (Carte bancaire)
5. Click "Continuer"
6. Fill form:
   - First name: John
   - Last name: Doe
   - Email: test@example.com
7. Click "Confirmer le don"
8. Should see success! ✅

---

## Troubleshooting (If Something Breaks)

### "Port 3000 already in use"
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### "Cannot connect to database"
Check PostgreSQL is running:
```bash
psql -U user -d H-L-A
```

If database doesn't exist:
```sql
CREATE DATABASE "H-L-A";
```

### "CORS error"
Make sure backend is running on :3000
Make sure frontend is on :5173

### "npm install fails"
```bash
cd server
rm -rf node_modules
npm install
```

---

## Files You Don't Need to Edit

✅ Everything should work out of the box!

- ✅ `.env` is already configured for localhost
- ✅ Database schema is auto-created
- ✅ Sample user is auto-inserted
- ✅ Frontend is updated

---

## What You Can Now Do

✅ **Create donations** (anonymous or logged in)
✅ **Login/Register** new users
✅ **View donation history** (if logged in)
✅ **Change password** (if logged in)
✅ **View API docs** → Read `server/API_DOCUMENTATION.md`

---

## API Endpoints You Can Test

### With curl/Postman

#### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

#### Test Create Donation
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
      "email": "test@example.com",
      "phone": "+243999999999"
    }
  }'
```

---

## Next Steps

### To Learn More
- Read `README.md` for full overview
- Read `BACKEND_SETUP.md` for detailed setup
- Read `server/API_DOCUMENTATION.md` for all endpoints
- Read `ARCHITECTURE.md` for system design

### To Add Features
- Check `COMPLETE_SUMMARY.md` for what's available
- See `VERIFICATION_CHECKLIST.md` for status
- Review code in `server/controllers/`

### To Deploy
- See "Production" section in `README.md`
- Change JWT secrets in `.env`
- Set up production database
- Configure HTTPS

---

## Terminal Commands Cheat Sheet

```bash
# Frontend
npm run dev          # Start dev server (:5173)
npm run build        # Build for production
npm run preview      # Preview build

# Backend
cd server
npm install          # Install dependencies
npm start            # Start server (:3000)
node init-db.js      # Initialize database
node init-db.js      # Reset database (careful!)

# Database
psql -U user -d H-L-A  # Connect to database
CREATE DATABASE "H-L-A";  # Create database if not exists
DROP DATABASE "H-L-A";    # Delete database (careful!)
```

---

## Ports Reference

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Database:** H-L-A

---

## Sample Credentials

```
Email: demo@example.com
Password: password123
```

---

## That's It! 🎉

Your backend, authentication, and database are now:
- ✅ Running locally
- ✅ Connected to frontend
- ✅ Ready for testing
- ✅ Ready for development

Happy coding! 🚀

---

## Need Help?

Check these files:
1. **Can't connect:** → BACKEND_SETUP.md "Troubleshooting"
2. **Need API info:** → server/API_DOCUMENTATION.md
3. **Want to understand:** → ARCHITECTURE.md
4. **General questions:** → README.md
5. **What was made:** → COMPLETE_SUMMARY.md

---

**Time Elapsed:** ⏱️ ~5 minutes
**Status:** ✅ Ready!
**Next Action:** Test the /donations page!
