import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import tenantCompanyRoutes from './routes/tenantCompanyRoutes';
import employeeRoutes from './routes/employeeRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import noteRoutes from './routes/noteRoutes';
import meetingRoutes from './routes/meetingRoutes';
import clientRoutes from './routes/clientRoutes';
import revenueRoutes from './routes/revenueRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import aiRoutes from './routes/aiRoutes';
import billingRoutes from './routes/billingRoutes';
import timeLogRoutes from './routes/timeLogRoutes';
import expenseRoutes from './routes/expenseRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Multi-Company Management & AI System Backend API is active', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/platform/companies', companyRoutes); // Super admin only
app.use('/api/platform/billing', billingRoutes); // Super admin only
app.use('/api/company', tenantCompanyRoutes);
app.use('/api/company/employees', employeeRoutes);
app.use('/api/company/projects', projectRoutes);
app.use('/api/company/tasks', taskRoutes);
app.use('/api/company/notes', noteRoutes);
app.use('/api/company/meetings', meetingRoutes);
app.use('/api/company/clients', clientRoutes);
app.use('/api/company/revenues', revenueRoutes);
app.use('/api/company/expenses', expenseRoutes);
app.use('/api/company/time-logs', timeLogRoutes);
app.use('/api/company/dashboard', dashboardRoutes);
app.use('/api/company/analytics', analyticsRoutes);
app.use('/api/platform/audit-logs', auditLogRoutes); // Assuming Super admin views all audit logs or this needs company scoping too
app.use('/api/ai', aiRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
