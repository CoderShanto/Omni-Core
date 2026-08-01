import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Employee from '../models/Employee';
import Project from '../models/Project';
import Task from '../models/Task';
import Revenue from '../models/Revenue';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) return res.status(400).json({ message: 'No company associated with logged-in user' });

    const matchFilter = { companyId: new mongoose.Types.ObjectId(companyId as string) };

    // 1. Total Employees
    const totalEmployees = await Employee.countDocuments(matchFilter);

    // 2. Projects
    const projects = await Project.find(matchFilter);
    const totalProjects = projects.length;
    let completedProjects = 0;
    const projectStatusMap: Record<string, number> = { 'Pending': 0, 'In Progress': 0, 'Completed': 0, 'Cancelled': 0 };
    
    projects.forEach(p => {
      if (projectStatusMap[p.status] !== undefined) projectStatusMap[p.status]++;
      if (p.status === 'Completed') completedProjects++;
    });

    const projectStatusChart = Object.keys(projectStatusMap).map(status => ({ name: status, value: projectStatusMap[status] }));

    // 3. Tasks
    const tasks = await Task.find(matchFilter);
    const activeTasks = tasks.filter(t => ['Todo', 'Doing', 'Review'].includes(t.status)).length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const overdueTasks = tasks.filter(t => ['Todo', 'Doing', 'Review'].includes(t.status) && new Date(t.deadline) < new Date()).length;

    // 4. Revenue
    const revenues = await Revenue.find(matchFilter).sort({ dueDate: 1 });
    let totalPaidRevenue = 0;
    let totalPendingRevenue = 0;
    let overdueRevenue = 0;

    const revenueTrendMap: Record<string, { month: string; paid: number; pending: number }> = {};
    revenues.forEach(r => {
      if (r.paymentStatus === 'Paid') totalPaidRevenue += r.amount;
      else if (r.paymentStatus === 'Pending') totalPendingRevenue += r.amount;
      else if (r.paymentStatus === 'Overdue') {
        totalPendingRevenue += r.amount;
        overdueRevenue += r.amount;
      }

      const d = new Date(r.dueDate);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!revenueTrendMap[monthKey]) revenueTrendMap[monthKey] = { month: monthKey, paid: 0, pending: 0 };
      if (r.paymentStatus === 'Paid') revenueTrendMap[monthKey].paid += r.amount;
      else revenueTrendMap[monthKey].pending += r.amount;
    });

    const revenueChart = Object.values(revenueTrendMap);

    // 5. Workload
    const employees = await Employee.find(matchFilter).select('_id name');
    const workloadMap: Record<string, { employeeName: string; taskCount: number }> = {};
    employees.forEach(e => { workloadMap[e._id.toString()] = { employeeName: e.name, taskCount: 0 }; });

    tasks.filter(t => t.status !== 'Done').forEach(t => {
      if (t.assignedTo && workloadMap[t.assignedTo.toString()]) {
        workloadMap[t.assignedTo.toString()].taskCount++;
      }
    });

    const employeeWorkloadChart = Object.values(workloadMap).filter(item => item.taskCount > 0);
    
    // --- Business Health Score Calculation ---
    // Finance Score: 100 if no overdue revenue. Deduct points for overdue vs total.
    let financeScore = 100;
    const totalExpected = totalPaidRevenue + totalPendingRevenue;
    if (totalExpected > 0) {
      financeScore = Math.max(0, 100 - ((overdueRevenue / totalExpected) * 100));
    }

    // Project Score: Ratio of completed/in-progress vs cancelled. Simple logic for MVP.
    let projectScore = 100;
    if (totalProjects > 0) {
       const cancelled = projectStatusMap['Cancelled'];
       projectScore = Math.max(0, 100 - ((cancelled / totalProjects) * 100));
    }

    // People Score: Check if anyone is overloaded (>5 active tasks)
    let peopleScore = 100;
    let overloadedCount = 0;
    Object.values(workloadMap).forEach(w => {
      if (w.taskCount > 5) overloadedCount++;
    });
    if (totalEmployees > 0) {
       peopleScore = Math.max(0, 100 - ((overloadedCount / totalEmployees) * 100));
    }

    // Operations Score: overdue tasks penalty
    let opsScore = 100;
    if (activeTasks > 0) {
       opsScore = Math.max(0, 100 - ((overdueTasks / activeTasks) * 100));
    }

    const overallHealthScore = Math.round((financeScore + projectScore + peopleScore + opsScore) / 4);

    return res.json({
      healthScore: {
        overall: overallHealthScore,
        subScores: {
          finance: Math.round(financeScore),
          project: Math.round(projectScore),
          people: Math.round(peopleScore),
          operations: Math.round(opsScore)
        }
      },
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
