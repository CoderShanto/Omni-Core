import { Request, Response, NextFunction } from 'express';
import Subscription from '../models/Subscription';
import Employee from '../models/Employee';
import Project from '../models/Project';

export const checkSeatQuota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role === 'Super Admin') return next();

    const companyId = req.user?.companyId;
    if (!companyId) return next();

    let sub = await Subscription.findOne({ companyId });
    if (!sub) {
      // Auto-initialize Free Trial subscription if missing
      sub = await Subscription.create({
        companyId,
        plan: 'Free Trial',
        status: 'active',
        seatLimit: 5,
        projectLimit: 10,
        aiQueryLimit: 50,
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000)
      });
    }

    const currentSeats = await Employee.countDocuments({ companyId });
    if (currentSeats >= sub.seatLimit) {
      return res.status(403).json({
        message: `Plan Quota Exceeded: Your ${sub.plan} plan is capped at ${sub.seatLimit} seats. Current usage: ${currentSeats}. Please upgrade your subscription plan under Billing to add more employees.`,
        quotaExceeded: 'seats',
        currentSeats,
        seatLimit: sub.seatLimit
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkProjectQuota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role === 'Super Admin') return next();

    const companyId = req.user?.companyId;
    if (!companyId) return next();

    let sub = await Subscription.findOne({ companyId });
    if (!sub) {
      sub = await Subscription.create({
        companyId,
        plan: 'Free Trial',
        status: 'active',
        seatLimit: 5,
        projectLimit: 10,
        aiQueryLimit: 50,
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000)
      });
    }

    const currentProjects = await Project.countDocuments({ companyId });
    if (currentProjects >= sub.projectLimit) {
      return res.status(403).json({
        message: `Plan Quota Exceeded: Your ${sub.plan} plan is capped at ${sub.projectLimit} active projects. Current usage: ${currentProjects}. Upgrade your subscription plan under Billing to create more projects.`,
        quotaExceeded: 'projects',
        currentProjects,
        projectLimit: sub.projectLimit
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
