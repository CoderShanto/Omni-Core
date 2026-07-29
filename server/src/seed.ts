import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Company from './models/Company';
import Employee from './models/Employee';
import Project from './models/Project';
import Task from './models/Task';
import Note from './models/Note';
import Meeting from './models/Meeting';
import Client from './models/Client';
import Revenue from './models/Revenue';
import Subscription from './models/Subscription';
import TimeLog from './models/TimeLog';
import Expense from './models/Expense';
import AuditLog from './models/AuditLog';

dotenv.config();

const seed = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/company_management';
    await mongoose.connect(connStr);
    console.log('[Seed] Connected to MongoDB database...');

    // Clear existing collections
    await User.deleteMany({});
    await Company.deleteMany({});
    await Employee.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Note.deleteMany({});
    await Meeting.deleteMany({});
    await Client.deleteMany({});
    await Revenue.deleteMany({});
    await Subscription.deleteMany({});
    await TimeLog.deleteMany({});
    await Expense.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('[Seed] Cleared existing collection data.');

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('Password123!', salt);

    // 1. Create Super Admin
    const superAdmin = await User.create({
      name: 'Global System Admin',
      email: 'admin@platform.com',
      password: commonPassword,
      role: 'Super Admin',
      companyId: null
    });
    console.log('[Seed] Created Super Admin user (admin@platform.com)');

    // 2. Create Company 1: Apex Tech Solutions
    const apexCompany = await Company.create({
      name: 'Apex Tech Solutions',
      industry: 'Software & Cloud Services',
      address: '100 Silicon Valley Way, Suite 400',
      email: 'contact@apextech.com',
      phone: '+1 (555) 019-2834'
    });

    // Create Company 2: Horizon Media
    const horizonCompany = await Company.create({
      name: 'Horizon Media Group',
      industry: 'Digital Marketing & PR',
      address: '450 Madison Avenue, New York',
      email: 'hello@horizonmedia.com',
      phone: '+1 (555) 092-8811'
    });

    console.log('[Seed] Created 2 Companies: Apex Tech & Horizon Media');

    // 3. Create SaaS Subscriptions
    await Subscription.create({
      companyId: apexCompany._id,
      plan: 'Business',
      status: 'active',
      seatLimit: 50,
      projectLimit: 100,
      aiQueryLimit: 1000,
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000)
    });

    await Subscription.create({
      companyId: horizonCompany._id,
      plan: 'Starter',
      status: 'active',
      seatLimit: 10,
      projectLimit: 25,
      aiQueryLimit: 200,
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000)
    });

    // 4. Create Apex Users & Employees
    const apexCEOUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'ceo@apex.com',
      password: commonPassword,
      role: 'CEO',
      companyId: apexCompany._id
    });

    const apexManagerUser = await User.create({
      name: 'David Vance',
      email: 'manager@apex.com',
      password: commonPassword,
      role: 'Manager',
      companyId: apexCompany._id
    });

    const apexDevUser = await User.create({
      name: 'Alex Rivera',
      email: 'dev@apex.com',
      password: commonPassword,
      role: 'Employee',
      companyId: apexCompany._id
    });

    // Horizon Users
    await User.create({
      name: 'Michael Ross',
      email: 'ceo@horizon.com',
      password: commonPassword,
      role: 'CEO',
      companyId: horizonCompany._id
    });

    // Create Employee records in Apex Tech
    const empCEO = await Employee.create({
      companyId: apexCompany._id,
      userId: apexCEOUser._id,
      name: 'Sarah Jenkins',
      email: 'ceo@apex.com',
      designation: 'Chief Executive Officer',
      department: 'Executive',
      salary: 180000,
      joinDate: new Date('2023-01-15')
    });

    const empManager = await Employee.create({
      companyId: apexCompany._id,
      userId: apexManagerUser._id,
      name: 'David Vance',
      email: 'manager@apex.com',
      designation: 'Engineering Manager',
      department: 'Engineering',
      salary: 135000,
      joinDate: new Date('2023-03-01')
    });

    const empDev = await Employee.create({
      companyId: apexCompany._id,
      userId: apexDevUser._id,
      name: 'Alex Rivera',
      email: 'dev@apex.com',
      designation: 'Senior Full Stack Developer',
      department: 'Engineering',
      salary: 105000,
      joinDate: new Date('2023-06-10')
    });

    console.log('[Seed] Created User & Employee accounts.');

    // 5. Create Projects for Apex Tech
    const projAlpha = await Project.create({
      companyId: apexCompany._id,
      name: 'Project Alpha - Enterprise SaaS Platform',
      description: 'Building multi-tenant enterprise portal with real-time dashboard.',
      budget: 150000,
      deadline: new Date(Date.now() + 14 * 86400000), // 14 days from now
      status: 'In Progress',
      team: [empManager._id, empDev._id],
      createdBy: apexCEOUser._id
    });

    const projBeta = await Project.create({
      companyId: apexCompany._id,
      name: 'Project Beta - Cloud Migration Engine',
      description: 'Automated infrastructure migration script for AWS.',
      budget: 85000,
      deadline: new Date(Date.now() - 5 * 86400000), // Overdue 5 days
      status: 'In Progress',
      team: [empDev._id],
      createdBy: apexManagerUser._id
    });

    await Project.create({
      companyId: apexCompany._id,
      name: 'Mobile App Modernization',
      description: 'React Native app upgrade with biometric login.',
      budget: 60000,
      deadline: new Date(Date.now() + 45 * 86400000),
      status: 'Completed',
      team: [empManager._id],
      createdBy: apexCEOUser._id
    });

    console.log('[Seed] Created Projects.');

    // 6. Create Tasks for Apex Tech
    const taskAuth = await Task.create({
      companyId: apexCompany._id,
      projectId: projAlpha._id,
      title: 'Design Multi-Tenant Database Schema',
      description: 'Ensure companyId indexes and tenant isolation.',
      priority: 'High',
      deadline: new Date(Date.now() + 3 * 86400000),
      status: 'Done',
      assignedTo: empDev._id,
      createdBy: apexManagerUser._id
    });

    await Task.create([
      {
        companyId: apexCompany._id,
        projectId: projAlpha._id,
        title: 'Implement JWT Auth & RBAC Middleware',
        description: 'Protect all company endpoints with role check.',
        priority: 'Critical',
        deadline: new Date(Date.now() + 2 * 86400000),
        status: 'Doing',
        assignedTo: empDev._id,
        createdBy: apexManagerUser._id
      },
      {
        companyId: apexCompany._id,
        projectId: projBeta._id,
        title: 'Fix Docker Swarm Clustering Failure',
        description: 'Debug container communication error on production node.',
        priority: 'Critical',
        deadline: new Date(Date.now() - 2 * 86400000), // Overdue!
        status: 'Doing',
        assignedTo: empDev._id,
        createdBy: apexManagerUser._id
      }
    ]);

    console.log('[Seed] Created Tasks.');

    // 7. Time Logs & Expenses
    await TimeLog.create([
      {
        companyId: apexCompany._id,
        employeeId: empDev._id,
        projectId: projAlpha._id,
        taskId: taskAuth._id,
        durationMinutes: 240,
        isBillable: true,
        hourlyRate: 75,
        date: new Date(Date.now() - 86400000),
        notes: 'Completed database index design & schema optimization.'
      },
      {
        companyId: apexCompany._id,
        employeeId: empManager._id,
        projectId: projAlpha._id,
        durationMinutes: 120,
        isBillable: true,
        hourlyRate: 90,
        date: new Date(),
        notes: 'Sprint planning and client architecture review.'
      }
    ]);

    await Expense.create([
      {
        companyId: apexCompany._id,
        employeeId: empDev._id,
        category: 'Software',
        amount: 299,
        description: 'JetBrains IDE License & Cloud Server Hosting',
        status: 'Approved',
        approvedBy: apexCEOUser._id
      },
      {
        companyId: apexCompany._id,
        employeeId: empManager._id,
        category: 'Travel',
        amount: 450,
        description: 'Client Onboarding Conference Flight',
        status: 'Pending'
      }
    ]);

    // 8. Clients & Revenue
    const clientAcme = await Client.create({
      companyId: apexCompany._id,
      name: 'Robert Vance',
      companyName: 'Acme Global Corp',
      email: 'robert@acmeglobal.com',
      phone: '+1 (555) 443-1200'
    });

    const clientStarlight = await Client.create({
      companyId: apexCompany._id,
      name: 'Elena Rostova',
      companyName: 'Starlight Tech Inc',
      email: 'elena@starlight.io',
      phone: '+1 (555) 991-4422'
    });

    await Revenue.create([
      {
        companyId: apexCompany._id,
        projectId: projAlpha._id,
        clientId: clientAcme._id,
        title: 'Phase 1 Milestone Invoice',
        amount: 45000,
        paymentStatus: 'Paid',
        dueDate: new Date(Date.now() - 30 * 86400000),
        paidDate: new Date(Date.now() - 28 * 86400000)
      },
      {
        companyId: apexCompany._id,
        projectId: projAlpha._id,
        clientId: clientAcme._id,
        title: 'Phase 2 Architecture Invoice',
        amount: 35000,
        paymentStatus: 'Paid',
        dueDate: new Date(Date.now() - 10 * 86400000),
        paidDate: new Date(Date.now() - 8 * 86400000)
      },
      {
        companyId: apexCompany._id,
        projectId: projBeta._id,
        clientId: clientStarlight._id,
        title: 'Cloud Infrastructure Retainer',
        amount: 28000,
        paymentStatus: 'Pending',
        dueDate: new Date(Date.now() + 5 * 86400000)
      }
    ]);

    // 9. Notes, Meetings, and Security Audit Logs
    await Note.create({
      companyId: apexCompany._id,
      title: 'Architecture Best Practices & Tenant Isolation Rules',
      content: 'All database queries must enforce companyId filtering from the authenticated JWT token claim.',
      tags: ['architecture', 'security', 'multi-tenancy'],
      authorId: apexCEOUser._id
    });

    await Meeting.create({
      companyId: apexCompany._id,
      title: 'Weekly Executive & Engineering Sync',
      summary: 'Reviewed Project Alpha progress and aligned on upcoming client milestones.',
      actionItems: [
        { task: 'Resolve Docker Swarm issue on Project Beta', owner: 'Alex Rivera', completed: false },
        { task: 'Send Phase 3 proposal to Acme Global Corp', owner: 'Sarah Jenkins', completed: true }
      ],
      projectId: projAlpha._id,
      createdBy: apexCEOUser._id
    });

    await AuditLog.create([
      {
        companyId: apexCompany._id,
        userId: apexCEOUser._id,
        userName: 'Sarah Jenkins',
        userEmail: 'ceo@apex.com',
        userRole: 'CEO',
        action: 'UPGRADE_SUBSCRIPTION_PLAN',
        entity: 'Subscription',
        ipAddress: '192.168.1.1',
        details: 'Upgraded tenant plan to Business Tier.'
      },
      {
        companyId: apexCompany._id,
        userId: apexManagerUser._id,
        userName: 'David Vance',
        userEmail: 'manager@apex.com',
        userRole: 'Manager',
        action: 'CREATE_PROJECT',
        entity: 'Project',
        ipAddress: '192.168.1.42',
        details: 'Created Project Alpha SaaS Platform.'
      }
    ]);

    console.log('[Seed] Created Knowledge Base, Meetings, Time Logs & Security Audit Records.');
    console.log('----------------------------------------------------');
    console.log('SEED COMPLETE! Ready for full multi-tenant testing.');
    console.log('Login credentials (Password for all: Password123!):');
    console.log('  Super Admin: admin@platform.com');
    console.log('  CEO (Apex):   ceo@apex.com');
    console.log('  Manager:     manager@apex.com');
    console.log('  Employee:    dev@apex.com');
    console.log('  CEO (Horizon): ceo@horizon.com');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seed();
