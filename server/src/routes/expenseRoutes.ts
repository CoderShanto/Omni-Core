import { Router } from 'express';
import { getExpenses, createExpense, updateExpenseStatus } from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', getExpenses);
router.post('/', createExpense);
router.patch('/:id/status', requireRole(['CEO', 'Manager']), updateExpenseStatus);

export default router;
