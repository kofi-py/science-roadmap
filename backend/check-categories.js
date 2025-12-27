require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'science_roadmap',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function checkCategories() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Fetching categories...');
        const result = await client.query('SELECT * FROM categories ORDER BY id');

        console.log('Found categories:');
        result.rows.forEach(cat => {
            console.log(`- ${cat.id}: ${cat.name} (${cat.icon})`);
        });

        client.release();
        pool.end();
    } catch (err) {
        console.error('Error fetching categories:', err);
        pool.end();
        process.exit(1);
    }
}

checkCategories();
