import { Router } from 'express';
import { getCompanies, createCompany, getCompanyById, updateCompany } from '../controllers/companyController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getCompanies);
router.post('/', requireRole(['Super Admin']), createCompany);
router.get('/:id', getCompanyById);
router.put('/:id', requireRole(['Super Admin', 'CEO']), updateCompany);

export default router;
