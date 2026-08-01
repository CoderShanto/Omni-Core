import { Request, Response } from 'express';
import Expense, { ExpenseStatus } from '../models/Expense';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const expenses = await Expense.find(filter)
      .populate('employeeId', 'name designation department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json(expenses);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching expense requests', error: (error as Error).message });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { employeeId, category, amount, description, receiptUrl } = req.body;

    const companyId = req.user?.companyId;

    if (!employeeId || !amount || !description) {
      return res.status(400).json({ message: 'Employee ID, amount, and description are required' });
    }

    const expense = new Expense({
      companyId,
      employeeId,
      category: category || 'Office',
      amount: Number(amount),
      description,
      receiptUrl: receiptUrl || '',
      status: 'Pending'
    });

    await expense.save();
    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting expense', error: (error as Error).message });
  }
};

export const updateExpenseStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: ExpenseStatus };

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid expense status' });
    }

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense record not found' });

    if (req.user?.companyId?.toString() !== expense.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    expense.status = status;
    if (status === 'Approved') {
      expense.approvedBy = req.user?.userId as any;
    }

    await expense.save();
    return res.json(expense);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating expense status', error: (error as Error).message });
  }
};
