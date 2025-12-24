import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Init Database
initDb().catch(console.error);

// Routes
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import analyticsRoutes from './routes/analytics.js';
import cardRoutes from './routes/cards.js';
import budgetRoutes from './routes/budgets.js';

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
