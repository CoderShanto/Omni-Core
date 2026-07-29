import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/stats', requireRole(['Super Admin', 'CEO', 'Manager']), getDashboardStats);

export default router;
