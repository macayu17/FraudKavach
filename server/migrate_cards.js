import { getDb } from './database.js';

async function migrate() {
    const db = await getDb();
    try {
        await db.exec(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        card_number TEXT,
        card_holder TEXT,
        expiry_date TEXT,
        cvv TEXT,
        type TEXT DEFAULT 'Virtual',
        status TEXT DEFAULT 'Active',
        spending_limit REAL,
        color TEXT DEFAULT 'visa-blue',
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
        console.log('Migration successful: Created cards table');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
