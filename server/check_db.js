import { getDb } from './database.js';

async function checkTables() {
    try {
        const db = await getDb();
        const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table';");
        console.log('Tables:', tables.map(t => t.name));

        // Check cards columns if table exists
        const cardsTable = tables.find(t => t.name === 'cards');
        if (cardsTable) {
            const columns = await db.all("PRAGMA table_info(cards);");
            console.log('Cards Columns:', columns.map(c => c.name));
        } else {
            console.log('Cards table NOT found!');
        }

    } catch (err) {
        console.error(err);
    }
}

checkTables();
