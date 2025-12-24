import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getBudgets, setBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', setBudget);

export default router;
