import { getDb } from './database.js';

async function migrate() {
    const db = await getDb();
    try {
        await db.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        category TEXT,
        amount_limit REAL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
        console.log('Migration successful: Created budgets table');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
