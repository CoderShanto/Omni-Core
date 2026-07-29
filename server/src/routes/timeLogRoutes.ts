import { Router } from 'express';
import { getTimeLogs, createTimeLog } from '../controllers/timeLogController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getTimeLogs);
router.post('/', createTimeLog);

export default router;
