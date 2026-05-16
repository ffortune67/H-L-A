/**
 * Database initialization script
 * Run this once to create all tables and indexes
 * 
 * Usage: node server/init-db.js
 */

const fs = require('fs');
const path = require('path');
const pool = require('./config/db');
require('dotenv').config();

async function initializeDatabase() {
    try {
        console.log('🔄 Initializing database...');

        // Read the SQL file
        const sqlFile = path.join(__dirname, 'config', 'database.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute the SQL statements
        const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 60)}...`);
            await pool.query(statement);
        }

        console.log('✓ Database initialized successfully!');

        // Insert some sample data
        console.log('\n📝 Creating sample user and contribution...');
        
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const userResult = await pool.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, country) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id`,
            ['demo@example.com', passwordHash, 'Demo', 'User', 'DRC']
        );

        const userId = userResult.rows[0].id;
        console.log(`✓ Sample user created (ID: ${userId})`);

        await pool.query(
            `INSERT INTO contributions 
            (user_id, email, first_name, last_name, amount, currency, cause, frequency, payment_method, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [userId, 'demo@example.com', 'Demo', 'User', 50, 'USD', 'general', 'unique', 'card', 'Confirmé']
        );

        console.log('✓ Sample contribution created');

        console.log('\n✅ Database initialization complete!');
        console.log('\nSample credentials:');
        console.log('  Email: demo@example.com');
        console.log('  Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

initializeDatabase();
