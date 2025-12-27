require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'science_roadmap',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Reading schema...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema migration...');
        await client.query(schemaSql);

        console.log('Database initialized successfully!');
        client.release();
        pool.end();
    } catch (err) {
        console.error('Error initializing database:', err);
        pool.end();
        process.exit(1);
    }
}

setupDatabase();
