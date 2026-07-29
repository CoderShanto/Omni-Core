import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.user?.role !== 'Super Admin') {
      if (!req.user?.companyId) return res.json([]);
      filter.companyId = req.user.companyId;
    }

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(100);
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching audit logs', error: (error as Error).message });
  }
};

export const logAuditEvent = async (
  req: Request,
  action: string,
  entity: string,
  details: string = ''
) => {
  try {
    if (!req.user) return;

    await AuditLog.create({
      companyId: req.user.companyId || null,
      userId: req.user.userId,
      userName: req.user.email.split('@')[0],
      userEmail: req.user.email,
      userRole: req.user.role,
      action,
      entity,
      ipAddress: req.ip || '127.0.0.1',
      details
    });
  } catch (err) {
    console.error('[Audit Logger Error]', err);
  }
};
