import { Router } from 'express';
import { getRevenues, createRevenue, updateRevenueStatus } from '../controllers/revenueController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', requireRole(['CEO', 'Manager']), getRevenues);
router.post('/', requireRole(['CEO']), createRevenue);
router.patch('/:id/status', requireRole(['CEO']), updateRevenueStatus);

export default router;
