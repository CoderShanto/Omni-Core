import { Router } from 'express';
import { getProjectRisks, getRevenueForecast, askAI } from '../controllers/aiController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/risk-analysis', requireRole(['Super Admin', 'CEO', 'Manager']), getProjectRisks);
router.get('/revenue-forecast', requireRole(['Super Admin', 'CEO']), getRevenueForecast);
router.post('/query', requireRole(['Super Admin', 'CEO', 'Manager']), askAI);

export default router;
