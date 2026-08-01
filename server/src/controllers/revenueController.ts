import { Request, Response } from 'express';
import Revenue from '../models/Revenue';

export const getRevenues = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const revenues = await Revenue.find(filter)
      .populate('projectId', 'name status')
      .populate('clientId', 'name companyName')
      .sort({ dueDate: -1 });

    return res.json(revenues);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching revenue entries', error: (error as Error).message });
  }
};

export const createRevenue = async (req: Request, res: Response) => {
  try {
    const { title, amount, paymentStatus, dueDate, projectId, clientId, paidDate } = req.body;

    const companyId = req.user?.companyId;

    if (!title || amount === undefined || !dueDate) {
      return res.status(400).json({ message: 'Title, amount, and due date are required' });
    }

    const revenue = new Revenue({
      companyId,
      title,
      amount: Number(amount),
      paymentStatus: paymentStatus || 'Pending',
      dueDate,
      paidDate: paymentStatus === 'Paid' ? (paidDate || new Date()) : null,
      projectId: projectId || null,
      clientId: clientId || null
    });

    await revenue.save();
    return res.status(201).json(revenue);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating revenue entry', error: (error as Error).message });
  }
};

export const updateRevenueStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paidDate } = req.body;

    const revenue = await Revenue.findById(id);
    if (!revenue) return res.status(404).json({ message: 'Revenue entry not found' });

    if (req.user?.companyId?.toString() !== revenue.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized modification' });
    }

    if (paymentStatus) {
      revenue.paymentStatus = paymentStatus;
      if (paymentStatus === 'Paid' && !revenue.paidDate) {
        revenue.paidDate = paidDate || new Date();
      }
    }

    await revenue.save();
    return res.json(revenue);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating revenue status', error: (error as Error).message });
  }
};
