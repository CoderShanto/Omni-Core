import { Request, Response } from 'express';
import Subscription, { PlanTier } from '../models/Subscription';
import Employee from '../models/Employee';
import Project from '../models/Project';
import Company from '../models/Company';

const PLAN_LIMITS: Record<PlanTier, { seatLimit: number; projectLimit: number; aiQueryLimit: number; priceMonthly: number }> = {
  'Free Trial': { seatLimit: 5, projectLimit: 10, aiQueryLimit: 50, priceMonthly: 0 },
  'Starter': { seatLimit: 10, projectLimit: 25, aiQueryLimit: 200, priceMonthly: 49 },
  'Business': { seatLimit: 50, projectLimit: 100, aiQueryLimit: 1000, priceMonthly: 199 },
  'Enterprise': { seatLimit: 999, projectLimit: 999, aiQueryLimit: 9999, priceMonthly: 499 }
};

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId && req.user?.role !== 'Super Admin') {
      return res.status(400).json({ message: 'No company associated with account' });
    }

    const targetCompanyId = companyId || req.query.companyId;

    let sub = await Subscription.findOne({ companyId: targetCompanyId });
    if (!sub && targetCompanyId) {
      sub = await Subscription.create({
        companyId: targetCompanyId,
        plan: 'Free Trial',
        status: 'active',
        seatLimit: 5,
        projectLimit: 10,
        aiQueryLimit: 50,
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000)
      });
    }

    const usedSeats = await Employee.countDocuments({ companyId: targetCompanyId });
    const usedProjects = await Project.countDocuments({ companyId: targetCompanyId });

    return res.json({
      subscription: sub,
      usage: {
        usedSeats,
        usedProjects,
        usedAiQueries: 12 // Sample active usage
      },
      planTiers: PLAN_LIMITS
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching billing subscription status', error: (error as Error).message });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body as { plan: PlanTier };
    const companyId = req.user?.companyId || req.body.companyId;

    if (!companyId) return res.status(400).json({ message: 'Company ID is required' });
    if (!PLAN_LIMITS[plan]) return res.status(400).json({ message: 'Invalid plan tier requested' });

    const limits = PLAN_LIMITS[plan];

    let sub = await Subscription.findOne({ companyId });
    if (!sub) {
      sub = new Subscription({ companyId });
    }

    sub.plan = plan;
    sub.status = 'active';
    sub.seatLimit = limits.seatLimit;
    sub.projectLimit = limits.projectLimit;
    sub.aiQueryLimit = limits.aiQueryLimit;
    sub.currentPeriodEnd = new Date(Date.now() + 30 * 86400000);

    await sub.save();

    return res.json({
      message: `Subscription successfully upgraded to ${plan} Plan!`,
      subscription: sub
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating subscription plan', error: (error as Error).message });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    if (!PLAN_LIMITS[plan as PlanTier]) {
      return res.status(400).json({ message: 'Invalid plan tier' });
    }

    // Returns checkout session metadata (ready for Stripe integration)
    return res.json({
      checkoutUrl: `/billing?session=success&plan=${plan}`,
      sessionId: `cs_test_${Date.now()}`,
      plan,
      amount: PLAN_LIMITS[plan as PlanTier].priceMonthly
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating checkout session', error: (error as Error).message });
  }
};
