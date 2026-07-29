import { Router } from 'express';
import { getMeetings, createMeeting, toggleActionItem } from '../controllers/meetingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getMeetings);
router.post('/', requireRole(['Super Admin', 'CEO', 'Manager']), createMeeting);
router.patch('/:id/action-items/:itemIndex', toggleActionItem);

export default router;
