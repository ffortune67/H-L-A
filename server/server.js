const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const donationsRoutes = require('./routes/donationsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const { corsHeaders, requestLogger, errorHandler } = require('./middleware/authMiddleware');

// Initialize app
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// =====================
// MIDDLEWARE
// =====================

// Request logging
app.use(requestLogger);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Custom CORS headers
app.use(corsHeaders);

// =====================
// ROUTES
// =====================

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

// Legacy route support (for existing frontend code)
app.post('/api/payments', (req, res) => {
    // Forward to donations endpoint for backward compatibility
    const { amount, frequency, cause, paymentMethod, customer } = req.body;
    
    // Create a contribution
    const pool = require('./config/db');
    const donationsController = require('./controllers/donationsController');
    
    req.body = {
        amount,
        currency: 'USD',
        cause: cause || 'general',
        frequency: frequency || 'unique',
        paymentMethod: paymentMethod || 'card',
        customer: customer || {}
    };
    
    return donationsController.createContribution(req, res);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Error handling middleware
app.use(errorHandler);

// =====================
// SERVER START
// =====================

const server = app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;
