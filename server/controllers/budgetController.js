import { getDb } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

export const getBudgets = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = await getDb();

        // Get budgets and join with transactions to calculate current spend
        const budgets = await db.all('SELECT * FROM budgets WHERE user_id = ?', [userId]);

        // Calculate spend for this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const spendData = await db.all(
            `SELECT category, SUM(amount) as spent 
       FROM transactions 
       WHERE user_id = ? AND date >= ? 
       GROUP BY category`,
            [userId, startOfMonth.toISOString()]
        );

        const spendMap = {};
        spendData.forEach(s => spendMap[s.category] = s.spent);

        const budgetsWithSpend = budgets.map(b => ({
            ...b,
            spent: spendMap[b.category] || 0,
            remaining: b.amount_limit - (spendMap[b.category] || 0)
        }));

        res.json(budgetsWithSpend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
};

export const setBudget = async (req, res) => {
    try {
        const { category, amount_limit } = req.body;
        const userId = req.user.id;
        const db = await getDb();

        // Check if budget exists for category
        const existing = await db.get('SELECT id FROM budgets WHERE user_id = ? AND category = ?', [userId, category]);

        if (existing) {
            await db.run('UPDATE budgets SET amount_limit = ? WHERE id = ?', [amount_limit, existing.id]);
        } else {
            const id = uuidv4();
            await db.run('INSERT INTO budgets (id, user_id, category, amount_limit) VALUES (?, ?, ?, ?)',
                [id, userId, category, amount_limit]);
        }

        res.status(201).json({ message: 'Budget set' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to set budget' });
    }
};
