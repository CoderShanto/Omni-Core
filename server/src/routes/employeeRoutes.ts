import { Router } from 'express';
import { getEmployees, createEmployee, getEmployeeById, updateEmployee } from '../controllers/employeeController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { requireTenantMember } from '../middlewares/tenantMiddleware';
import { checkSeatQuota } from '../middlewares/quotaMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', getEmployees);
router.post('/', requireRole(['CEO', 'Manager']), checkSeatQuota, createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', requireRole(['CEO', 'Manager']), updateEmployee);

export default router;
