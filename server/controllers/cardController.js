import { getDb } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

export const createCard = async (req, res) => {
    try {
        const { type = 'Virtual', spending_limit = 1000, color = 'visa-blue', card_holder } = req.body;
        const userId = req.user.id;
        console.log('Creating card for User ID:', userId);
        const db = await getDb();

        // Generate random card details
        const cardNumber = '4' + Array(15).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 3);
        const expiryStr = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).slice(-2)}`;
        const cvv = String(Math.floor(100 + Math.random() * 900));
        const id = uuidv4();

        const finalCardHolder = card_holder || req.user.name || 'Valued Member';

        await db.run(
            `INSERT INTO cards (id, user_id, card_number, card_holder, expiry_date, cvv, type, status, spending_limit, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, userId, cardNumber, finalCardHolder, expiryStr, cvv, type, 'Active', spending_limit, color]
        );

        res.status(201).json({ message: 'Card created', card: { id, cardNumber, expiryStr, type, status: 'Active', color } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to create card' });
    }
};

export const getCards = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = await getDb();
        const cards = await db.all('SELECT * FROM cards WHERE user_id = ?', [userId]);
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
};

export const toggleCardStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Active' or 'Frozen'
        const userId = req.user.id;
        const db = await getDb();

        await db.run('UPDATE cards SET status = ? WHERE id = ? AND user_id = ?', [status, id, userId]);
        res.json({ message: `Card ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update card status' });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const db = await getDb();

        await db.run('DELETE FROM cards WHERE id = ? AND user_id = ?', [id, userId]);
        res.json({ message: 'Card deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
};
