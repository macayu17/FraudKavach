import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
let db;

export async function getDb() {
    if (db) return db;

    db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    return db;
}

export async function initDb() {
    const db = await getDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      merchant TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL, -- 'success', 'failed', 'flagged'
      risk_score INTEGER DEFAULT 0,
      risk_level TEXT DEFAULT 'low',
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      payment_type TEXT,
      location TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
    console.log('Database initialized');
}
