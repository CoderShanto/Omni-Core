import { Request, Response, NextFunction } from 'express';

// Middleware to enforce strict tenant isolation (acting user must be a member of the company)
export const requireTenantMember = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role === 'Super Admin') {
    return res.status(403).json({ message: 'Forbidden: Super Admins cannot access tenant-specific resources.' });
  }

  if (!req.user.companyId) {
    return res.status(403).json({ message: 'Forbidden: User is not assigned to a company.' });
  }

  // The tenant id is verified to exist. Controllers must use req.user.companyId to filter all queries.
  next();
};

// Middleware for actions that ONLY the CEO of the specific company can perform (e.g. role management)
export const requireCEOOfCompany = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'CEO') {
    return res.status(403).json({ message: 'Forbidden: Only the CEO can perform this action.' });
  }

  if (!req.user.companyId) {
    return res.status(403).json({ message: 'Forbidden: CEO is not assigned to a company.' });
  }

  next();
};
