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

async function updateCategories() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        const categories = [
            { name: 'biology', icon: '🧬', description: 'All things life science' },
            { name: 'chemistry', icon: '⚗️', description: 'Reactions, elements, and compounds' },
            { name: 'physics', icon: '⚡', description: 'Forces, motion, and energy' },
            { name: 'earth science', icon: '🌍', description: 'Geology, meteorology, and astronomy' },
            { name: 'general discussion', icon: '💬', description: 'Anything and everything science' }
        ];

        console.log('Inserting new categories...');

        for (const cat of categories) {
            await client.query(
                `INSERT INTO categories (name, icon, description) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`, // Assumes name constraint might not exist, but good practice. 
                // Note: schema.sql doesn't inherently enforce UNIQUE on name unless added earlier, 
                // but we rely on the fact we just want to ADD them.
                [cat.name, cat.icon, cat.description]
            );
            console.log(`Added: ${cat.name}`);
        }

        console.log('Categories updated successfully!');
        client.release();
        pool.end();
    } catch (err) {
        console.error('Error updating categories:', err);
        pool.end();
        process.exit(1);
    }
}

updateCategories();
