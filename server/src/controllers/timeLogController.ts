import { Request, Response } from 'express';
import TimeLog from '../models/TimeLog';
import Employee from '../models/Employee';

export const getTimeLogs = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const logs = await TimeLog.find(filter)
      .populate('employeeId', 'name designation department')
      .populate('projectId', 'name')
      .populate('taskId', 'title')
      .sort({ date: -1 });

    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching time logs', error: (error as Error).message });
  }
};

export const createTimeLog = async (req: Request, res: Response) => {
  try {
    const { employeeId, taskId, projectId, durationMinutes, isBillable, hourlyRate, notes, date } = req.body;

    const companyId = req.user?.companyId;

    if (!employeeId || durationMinutes === undefined) {
      return res.status(400).json({ message: 'Employee ID and duration are required' });
    }

    const log = new TimeLog({
      companyId,
      employeeId,
      taskId: taskId || null,
      projectId: projectId || null,
      durationMinutes: Number(durationMinutes),
      isBillable: isBillable !== undefined ? isBillable : true,
      hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : 50,
      date: date || new Date(),
      notes: notes || ''
    });

    await log.save();
    return res.status(201).json(log);
  } catch (error) {
    return res.status(500).json({ message: 'Error recording time log', error: (error as Error).message });
  }
};
