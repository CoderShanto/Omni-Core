import { Router } from 'express';
import { getMeetings, createMeeting, toggleActionItem } from '../controllers/meetingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', getMeetings);
router.post('/', requireRole(['CEO', 'Manager']), createMeeting);
router.patch('/:id/action-items/:itemIndex', toggleActionItem);

export default router;
