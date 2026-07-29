import { Router } from 'express';
import { getTasks, createTask, updateTask, updateTaskStatus } from '../controllers/taskController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', requireRole(['Super Admin', 'CEO', 'Manager']), createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
