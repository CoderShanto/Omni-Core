import { Router } from 'express';
import { getTasks, createTask, updateTask, updateTaskStatus, checkTaskDeadlines } from '../controllers/taskController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/check-deadlines', requireRole(['CEO', 'Manager']), checkTaskDeadlines);
router.get('/', getTasks);
router.post('/', requireRole(['CEO', 'Manager']), createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
