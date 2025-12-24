import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createTransaction, getHistory } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', authenticateToken, createTransaction);
router.get('/', authenticateToken, getHistory);

export default router;
