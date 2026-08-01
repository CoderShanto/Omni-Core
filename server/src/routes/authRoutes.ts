import { Router } from 'express';
import { register, login, getMe, updateUserRole, provisionTenant } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

// CEO only
router.put('/users/:userId/role', authenticateToken, updateUserRole);

// Super Admin only (could also be in platformRoutes, but authRoutes is fine for now)
router.post('/provision-tenant', authenticateToken, requireRole(['Super Admin']), provisionTenant);

export default router;
