import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createCard, getCards, toggleCardStatus, deleteCard } from '../controllers/cardController.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createCard);
router.get('/', getCards);
router.patch('/:id/status', toggleCardStatus);
router.delete('/:id', deleteCard);

export default router;
