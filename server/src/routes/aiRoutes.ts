import { Router } from 'express';
import { getProjectRisks, getRevenueForecast, askAI, getRevenueLeaks, getWorkloadBurnout } from '../controllers/aiController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/risk-analysis', requireRole(['CEO', 'Manager']), getProjectRisks);
router.get('/revenue-forecast', requireRole(['CEO']), getRevenueForecast);
router.post('/query', requireRole(['CEO', 'Manager']), askAI);
router.get('/revenue-leaks', requireRole(['CEO']), getRevenueLeaks);
router.get('/workload-burnout', requireRole(['CEO', 'Manager']), getWorkloadBurnout);

export default router;
