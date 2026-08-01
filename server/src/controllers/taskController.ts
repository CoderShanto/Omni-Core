import { Request, Response } from 'express';
import Task from '../models/Task';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const { projectId } = req.query;
    if (projectId) {
      filter.projectId = projectId;
    }

    const tasks = await Task.find(filter)
      .populate('projectId', 'name status deadline')
      .populate('assignedTo', 'name email designation department')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching tasks', error: (error as Error).message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, deadline, projectId, assignedTo, status } = req.body;

    const companyId = req.user?.companyId;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Task title and deadline are required' });
    }

    const task = new Task({
      companyId,
      projectId: projectId || null,
      title,
      description: description || '',
      priority: priority || 'Medium',
      deadline,
      status: status || 'Todo',
      assignedTo: assignedTo || null,
      createdBy: req.user?.userId
    });

    await task.save();
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating task', error: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user?.companyId?.toString() !== task.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized task modification' });
    }

    // If role is Employee, ensure they only update status or fields allowed
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('projectId', 'name status')
      .populate('assignedTo', 'name email designation');

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating task', error: (error as Error).message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Todo', 'Doing', 'Review', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid task status value' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user?.companyId?.toString() !== task.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    task.status = status;
    await task.save();

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating task status', error: (error as Error).message });
  }
};

export const checkTaskDeadlines = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    
    // Find tasks that are not done and deadline is approaching within 48 hours or already missed
    const now = new Date();
    const threshold = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const atRiskTasks = await Task.find({
      companyId,
      status: { $ne: 'Done' },
      deadline: { $lte: threshold }
    })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    // In a real system, here we would trigger notificationService.notify(...)
    // For MVP we just return the identified tasks
    
    return res.json({
      message: `Found ${atRiskTasks.length} tasks at risk or overdue.`,
      atRiskTasks
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking task deadlines', error: (error as Error).message });
  }
};
