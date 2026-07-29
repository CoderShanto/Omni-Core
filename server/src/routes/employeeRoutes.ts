import { Router } from 'express';
import { getEmployees, createEmployee, getEmployeeById, updateEmployee } from '../controllers/employeeController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { checkSeatQuota } from '../middlewares/quotaMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getEmployees);
router.post('/', requireRole(['Super Admin', 'CEO', 'Manager']), checkSeatQuota, createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', requireRole(['Super Admin', 'CEO', 'Manager']), updateEmployee);

export default router;
