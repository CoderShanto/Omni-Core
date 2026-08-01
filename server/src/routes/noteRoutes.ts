import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/noteController';
import { authenticateToken } from '../middlewares/authMiddleware';

import { requireTenantMember } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireTenantMember);

router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
