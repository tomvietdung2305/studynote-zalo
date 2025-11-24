require('dotenv').config({ path: './server/.env' });
const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Running migration: Add connection_code and parent_name to students table...');

        await db.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS connection_code VARCHAR(10) UNIQUE,
            ADD COLUMN IF NOT EXISTS parent_name VARCHAR(255);
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
