import { Request, Response } from 'express';
import Project from '../models/Project';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const projects = await Project.find(filter)
      .populate('team', 'name email designation department')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching projects', error: (error as Error).message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, budget, deadline, team, status } = req.body;

    const companyId = req.user?.companyId;

    if (!name || !deadline) {
      return res.status(400).json({ message: 'Project name and deadline are required' });
    }

    const project = new Project({
      companyId,
      name,
      description: description || '',
      budget: budget || 0,
      deadline,
      status: status || 'Pending',
      team: team || [],
      createdBy: req.user?.userId
    });

    await project.save();
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating project', error: (error as Error).message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('team', 'name email designation department')
      .populate('createdBy', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user?.companyId?.toString() !== project.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to project' });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project', error: (error as Error).message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user?.companyId?.toString() !== project.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized modification' });
    }

    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('team', 'name email designation department')
      .populate('createdBy', 'name email');

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating project', error: (error as Error).message });
  }
};
