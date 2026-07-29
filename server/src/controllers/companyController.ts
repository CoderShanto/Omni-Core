import { Request, Response } from 'express';
import Company from '../models/Company';

export const getCompanies = async (req: Request, res: Response) => {
  try {
    if (req.user?.role === 'Super Admin') {
      const companies = await Company.find().sort({ createdAt: -1 });
      return res.json(companies);
    }

    if (!req.user?.companyId) {
      return res.status(404).json({ message: 'No company associated with user' });
    }

    const company = await Company.findById(req.user.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    return res.json([company]);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching companies', error: (error as Error).message });
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, industry, address, email, phone } = req.body;

    if (!name || !industry) {
      return res.status(400).json({ message: 'Company name and industry are required' });
    }

    const company = new Company({ name, industry, address, email, phone });
    await company.save();

    return res.status(201).json(company);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating company', error: (error as Error).message });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'Super Admin' && req.user?.companyId?.toString() !== id) {
      return res.status(403).json({ message: 'Unauthorized to view this company profile' });
    }

    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    return res.json(company);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching company details', error: (error as Error).message });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'Super Admin' && (req.user?.role !== 'CEO' || req.user?.companyId?.toString() !== id)) {
      return res.status(403).json({ message: 'Only Super Admin or Company CEO can update company details' });
    }

    const company = await Company.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    return res.json(company);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating company', error: (error as Error).message });
  }
};
