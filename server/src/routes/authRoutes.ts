import { Router } from 'express';
import { register, login, getMe, updateUserRole } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/users/:userId/role', authenticateToken, requireRole(['Super Admin']), updateUserRole);

export default router;
