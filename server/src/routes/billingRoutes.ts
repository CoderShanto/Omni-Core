import { Router } from 'express';
import { getSubscription, updatePlan, createCheckoutSession } from '../controllers/billingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getSubscription);
router.post('/upgrade', requireRole(['Super Admin', 'CEO']), updatePlan);
router.post('/checkout', requireRole(['Super Admin', 'CEO']), createCheckoutSession);

export default router;
