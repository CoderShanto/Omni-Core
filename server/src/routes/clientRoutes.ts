import { Router } from 'express';
import { getClients, createClient, updateClient } from '../controllers/clientController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getClients);
router.post('/', requireRole(['Super Admin', 'CEO', 'Manager']), createClient);
router.put('/:id', requireRole(['Super Admin', 'CEO', 'Manager']), updateClient);

export default router;
