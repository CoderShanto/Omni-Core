import { Router } from 'express';
import { getAnalyticsMetrics } from '../controllers/analyticsController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['Super Admin', 'CEO', 'Manager']), getAnalyticsMetrics);

export default router;
