import { getDb } from './database.js';

async function checkUsers() {
    try {
        const db = await getDb();
        const users = await db.all("SELECT * FROM users");
        console.log('Users found:', users.length);
        console.log(users);
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
