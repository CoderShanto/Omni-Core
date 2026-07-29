import { Router } from 'express';
import { getProjects, createProject, getProjectById, updateProject } from '../controllers/projectController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { checkProjectQuota } from '../middlewares/quotaMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getProjects);
router.post('/', requireRole(['Super Admin', 'CEO', 'Manager']), checkProjectQuota, createProject);
router.get('/:id', getProjectById);
router.put('/:id', requireRole(['Super Admin', 'CEO', 'Manager']), updateProject);

export default router;
