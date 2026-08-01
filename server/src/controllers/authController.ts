import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import Company from '../models/Company';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, companyId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Security: Only Super Admin can specify roles or companyId via a different endpoint (provision-tenant).
    // Standard registration is just a user account creation without a company.
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'Employee',
      companyId: null
    });

    await user.save();

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_antigravity_2026';
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, companyId: user.companyId },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_antigravity_2026';
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, companyId: user.companyId },
      secret,
      { expiresIn: '7d' }
    );

    // Fetch company name if assigned
    let companyName = null;
    if (user.companyId) {
      const comp = await Company.findById(user.companyId);
      if (comp) companyName = comp.name;
    }

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error: (error as Error).message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let companyName = null;
    if (user.companyId) {
      const comp = await Company.findById(user.companyId);
      if (comp) companyName = comp.name;
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching user profile', error: (error as Error).message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Enforce CEO requirement
    if (req.user?.role !== 'CEO' || req.user?.companyId?.toString() !== user.companyId?.toString()) {
      return res.status(403).json({ message: 'Only the CEO of this company can change roles.' });
    }

    if (role === 'CEO' || role === 'Super Admin') {
      return res.status(403).json({ message: 'Cannot assign CEO or Super Admin roles.' });
    }

    user.role = role;
    await user.save();

    return res.json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user role', error: (error as Error).message });
  }
};

export const provisionTenant = async (req: Request, res: Response) => {
  try {
    const { companyName, industry, ceoName, ceoEmail, ceoPassword } = req.body;

    if (!companyName || !industry || !ceoName || !ceoEmail || !ceoPassword) {
      return res.status(400).json({ message: 'Missing required fields for provisioning' });
    }

    const existingUser = await User.findOne({ email: ceoEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 1. Create Company
    const company = new Company({
      name: companyName,
      industry: industry,
    });
    await company.save();

    // 2. Create CEO
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ceoPassword, salt);

    const ceoUser = new User({
      name: ceoName,
      email: ceoEmail.toLowerCase(),
      password: hashedPassword,
      role: 'CEO',
      companyId: company._id
    });
    await ceoUser.save();

    return res.status(201).json({
      message: 'Tenant provisioned successfully',
      company,
      ceo: {
        id: ceoUser._id,
        name: ceoUser.name,
        email: ceoUser.email,
        role: ceoUser.role,
        companyId: ceoUser.companyId
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error provisioning tenant', error: (error as Error).message });
  }
};
