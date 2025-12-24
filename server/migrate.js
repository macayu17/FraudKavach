import { getDb } from './database.js';

async function migrate() {
    const db = await getDb();
    try {
        await db.exec('ALTER TABLE transactions ADD COLUMN risk_reasons TEXT');
        console.log('Migration successful: Added risk_reasons column');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column risk_reasons already exists');
        } else {
            console.error('Migration failed:', err);
        }
    }
}

migrate();
