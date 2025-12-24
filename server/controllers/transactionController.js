import { getDb } from '../database.js';
import { analyzeTransaction } from '../services/fraudEngine.js';
import { simulatePaymentProcessing } from '../services/paymentSimulator.js';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid if not present, or use random string. I'll use random string to save install time/deps.

const generateId = () => Math.random().toString(36).substring(2, 15);

export const createTransaction = async (req, res) => {
    try {
        const { amount, currency, merchant, category, type, location } = req.body;
        const userId = req.user.id;

        if (!amount || !currency || !merchant) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await getDb();

        // 1. Get User History for Fraud Analysis
        const history = await db.all(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 50',
            [userId]
        );

        // 2. Fraud Analysis
        const riskAnalysis = analyzeTransaction({ amount, merchant, category, type }, history);

        // 3. Simulate Payment (Delay & Failures)
        let status = 'success';
        try {
            await simulatePaymentProcessing({ amount });
        } catch (err) {
            status = 'failed';
        }

        // If High Risk, we might flag it but still "process" it or block it. 
        // For this simulation, we process it but mark as 'flagged' if High Risk and Success.
        if (status === 'success' && riskAnalysis.risk_level === 'High') {
            status = 'flagged';
        }

        const transactionId = generateId();

        // 4. Save to DB
        await db.run(
            `INSERT INTO transactions (
        id, user_id, amount, currency, merchant, category, status, 
        risk_score, risk_level, payment_type, location, risk_reasons
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                transactionId, userId, amount, currency, merchant, category, status,
                riskAnalysis.risk_score, riskAnalysis.risk_level, type, location,
                JSON.stringify(riskAnalysis.risk_reasons)
            ]
        );

        res.status(201).json({
            message: 'Transaction processed',
            transaction: {
                id: transactionId,
                status,
                risk_level: riskAnalysis.risk_level,
                risk_reasons: riskAnalysis.risk_reasons,
                amount,
                merchant
            }
        });

    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Server error processing payment' });
    }
};

export const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const db = await getDb();
        const transactions = await db.all(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );

        const parsedTransactions = transactions.map(t => ({
            ...t,
            risk_reasons: t.risk_reasons ? JSON.parse(t.risk_reasons) : []
        }));

        res.json(parsedTransactions);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
