import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import Employee from '../models/Employee';
import Task from '../models/Task';
import Revenue from '../models/Revenue';

export const getAnalyticsMetrics = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const filter = req.user?.role === 'Super Admin' && !companyId
      ? {}
      : { companyId: new mongoose.Types.ObjectId(companyId as string) };

    // 1. Project Completion Rate
    const projects = await Project.find(filter);
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // 2. Employee Utilization Metrics
    const employees = await Employee.find(filter);
    const activeTasks = await Task.find({
      ...filter,
      status: { $in: ['Todo', 'Doing', 'Review'] }
    });

    const totalActiveTasks = activeTasks.length;
    const avgTaskPerEmployee = employees.length > 0 ? (totalActiveTasks / employees.length).toFixed(1) : '0';

    // 3. Task Performance (On-time vs Overdue)
    const now = new Date();
    const allTasks = await Task.find(filter);
    let overdueTasks = 0;
    let onTimeTasks = 0;
    let completedOnTime = 0;

    allTasks.forEach(t => {
      const isOverdue = t.status !== 'Done' && new Date(t.deadline) < now;
      if (isOverdue) {
        overdueTasks++;
      } else if (t.status === 'Done') {
        completedOnTime++;
      } else {
        onTimeTasks++;
      }
    });

    const taskPerformance = {
      total: allTasks.length,
      overdue: overdueTasks,
      onTimeActive: onTimeTasks,
      completedOnTime,
      overduePercentage: allTasks.length > 0 ? Math.round((overdueTasks / allTasks.length) * 100) : 0
    };

    // 4. Financial Health Metrics
    const revenues = await Revenue.find(filter);
    let paidTotal = 0;
    let pendingTotal = 0;
    let overdueTotal = 0;

    revenues.forEach(r => {
      if (r.paymentStatus === 'Paid') paidTotal += r.amount;
      else if (r.paymentStatus === 'Pending') pendingTotal += r.amount;
      else if (r.paymentStatus === 'Overdue') overdueTotal += r.amount;
    });

    return res.json({
      projectCompletion: {
        totalProjects,
        completedProjects,
        inProgressProjects: projects.filter(p => p.status === 'In Progress').length,
        completionRate
      },
      employeeUtilization: {
        totalEmployees: employees.length,
        totalActiveTasks,
        avgTaskPerEmployee
      },
      taskPerformance,
      financialSummary: {
        paidTotal,
        pendingTotal,
        overdueTotal
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating business analytics', error: (error as Error).message });
  }
};
