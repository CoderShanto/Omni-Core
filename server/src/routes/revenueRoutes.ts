import { Router } from 'express';
import { getRevenues, createRevenue, updateRevenueStatus } from '../controllers/revenueController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRole(['Super Admin', 'CEO', 'Manager']), getRevenues);
router.post('/', requireRole(['Super Admin', 'CEO']), createRevenue);
router.patch('/:id/status', requireRole(['Super Admin', 'CEO']), updateRevenueStatus);

export default router;
