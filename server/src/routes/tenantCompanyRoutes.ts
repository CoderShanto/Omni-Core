import { Router } from 'express';
import { getCompanyById, updateCompany } from '../controllers/companyController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { requireTenantMember, requireCEOOfCompany } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

// User can view their own company profile
router.get('/profile', async (req, res) => {
  req.params.id = req.user?.companyId as string;
  return getCompanyById(req, res);
});

// Only CEO can update their company profile
router.put('/profile', requireCEOOfCompany, async (req, res) => {
  req.params.id = req.user?.companyId as string;
  return updateCompany(req, res);
});

export default router;
