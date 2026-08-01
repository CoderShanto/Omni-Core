import { Router } from 'express';
import { getClients, createClient, updateClient } from '../controllers/clientController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', getClients);
router.post('/', requireRole(['CEO', 'Manager']), createClient);
router.put('/:id', requireRole(['CEO', 'Manager']), updateClient);

export default router;
