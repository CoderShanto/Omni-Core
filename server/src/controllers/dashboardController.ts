import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Employee from '../models/Employee';
import Project from '../models/Project';
import Task from '../models/Task';
import Revenue from '../models/Revenue';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;

    if (req.user?.role !== 'Super Admin' && !companyId) {
      return res.status(400).json({ message: 'No company associated with logged-in user' });
    }

    const matchFilter = req.user?.role === 'Super Admin' && !companyId 
      ? {} 
      : { companyId: new mongoose.Types.ObjectId(companyId as string) };

    // 1. Total Employees
    const totalEmployees = await Employee.countDocuments(matchFilter);

    // 2. Total Projects & Status distribution
    const projects = await Project.find(matchFilter);
    const totalProjects = projects.length;
    const projectStatusMap: Record<string, number> = {
      'Pending': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0
    };
    projects.forEach(p => {
      if (projectStatusMap[p.status] !== undefined) {
        projectStatusMap[p.status]++;
      }
    });

    const projectStatusChart = Object.keys(projectStatusMap).map(status => ({
      name: status,
      value: projectStatusMap[status]
    }));

    // 3. Active Tasks
    const activeTasks = await Task.countDocuments({
      ...matchFilter,
      status: { $in: ['Todo', 'Doing', 'Review'] }
    });

    // 4. Revenue calculation & Revenue trend chart
    const revenues = await Revenue.find(matchFilter).sort({ dueDate: 1 });
    let totalPaidRevenue = 0;
    let totalPendingRevenue = 0;

    revenues.forEach(r => {
      if (r.paymentStatus === 'Paid') {
        totalPaidRevenue += r.amount;
      } else if (r.paymentStatus === 'Pending' || r.paymentStatus === 'Overdue') {
        totalPendingRevenue += r.amount;
      }
    });

    // Monthly revenue trend
    const revenueTrendMap: Record<string, { month: string; paid: number; pending: number }> = {};
    revenues.forEach(r => {
      const d = new Date(r.dueDate);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!revenueTrendMap[monthKey]) {
        revenueTrendMap[monthKey] = { month: monthKey, paid: 0, pending: 0 };
      }
      if (r.paymentStatus === 'Paid') {
        revenueTrendMap[monthKey].paid += r.amount;
      } else {
        revenueTrendMap[monthKey].pending += r.amount;
      }
    });

    const revenueChart = Object.values(revenueTrendMap);

    // 5. Employee Workload Chart (tasks per employee)
    const employees = await Employee.find(matchFilter).select('_id name designation department');
    const tasks = await Task.find({
      ...matchFilter,
      status: { $ne: 'Done' }
    });

    const workloadMap: Record<string, { employeeName: string; taskCount: number }> = {};
    employees.forEach(e => {
      workloadMap[e._id.toString()] = { employeeName: e.name, taskCount: 0 };
    });

    tasks.forEach(t => {
      if (t.assignedTo && workloadMap[t.assignedTo.toString()]) {
        workloadMap[t.assignedTo.toString()].taskCount++;
      }
    });

    const employeeWorkloadChart = Object.values(workloadMap).filter(item => item.taskCount > 0);

    return res.json({
      cards: {
        totalEmployees,
        totalProjects,
        activeTasks,
        totalRevenue: totalPaidRevenue,
        pendingPayments: totalPendingRevenue
      },
      charts: {
        revenueChart,
        projectStatusChart,
        employeeWorkloadChart
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error generating executive dashboard metrics', error: (error as Error).message });
  }
};
