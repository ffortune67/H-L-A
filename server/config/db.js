const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Test connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected:', result.rows[0]);
    }
});

module.exports = pool;