import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['Super Admin', 'CEO']), getAuditLogs);

export default router;
