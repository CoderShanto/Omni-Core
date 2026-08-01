import { Request, Response } from 'express';
import Employee from '../models/Employee';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const employees = await Employee.find(filter).populate('userId', 'name email role').sort({ createdAt: -1 });
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching employees', error: (error as Error).message });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, designation, department, salary, joinDate, userId } = req.body;

    const companyId = req.user?.companyId;

    if (!name || !email || !designation || !department) {
      return res.status(400).json({ message: 'Name, email, designation, and department are required' });
    }

    const employee = new Employee({
      companyId,
      userId: userId || null,
      name,
      email,
      designation,
      department,
      salary: salary || 0,
      joinDate: joinDate || new Date()
    });

    await employee.save();
    return res.status(201).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating employee', error: (error as Error).message });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate('userId', 'name email role');

    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (req.user?.companyId?.toString() !== employee.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to employee record' });
    }

    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching employee', error: (error as Error).message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (req.user?.companyId?.toString() !== employee.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized modification' });
    }

    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating employee', error: (error as Error).message });
  }
};
