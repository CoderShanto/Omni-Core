import { Router } from 'express';
import { getExpenses, createExpense, updateExpenseStatus } from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getExpenses);
router.post('/', createExpense);
router.patch('/:id/status', requireRole(['Super Admin', 'CEO', 'Manager']), updateExpenseStatus);

export default router;
