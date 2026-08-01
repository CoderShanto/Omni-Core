import { Router } from 'express';
import { getTimeLogs, createTimeLog } from '../controllers/timeLogController';
import { authenticateToken } from '../middlewares/authMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', getTimeLogs);
router.post('/', createTimeLog);

export default router;
