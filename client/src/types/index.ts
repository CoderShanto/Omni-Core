export type UserRole = 'Super Admin' | 'CEO' | 'Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string | null;
  companyName?: string | null;
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  address?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

export interface Employee {
  _id: string;
  companyId: string;
  userId?: { _id: string; name: string; email: string; role: UserRole };
  name: string;
  email: string;
  designation: string;
  department: string;
  salary: number;
  joinDate: string;
}

export type ProjectStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Project {
  _id: string;
  companyId: string;
  name: string;
  description: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  team: Employee[];
  createdBy?: { _id: string; name: string; email: string };
  createdAt?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Todo' | 'Doing' | 'Review' | 'Done';

export interface Task {
  _id: string;
  companyId: string;
  projectId?: { _id: string; name: string; status: string; deadline?: string };
  title: string;
  description: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  assignedTo?: Employee;
  createdBy?: { _id: string; name: string };
  createdAt?: string;
}

export interface Note {
  _id: string;
  companyId: string;
  title: string;
  content: string;
  tags: string[];
  authorId: { _id: string; name: string; role: string };
  createdAt?: string;
}

export interface ActionItem {
  task: string;
  owner?: string;
  completed: boolean;
}

export interface Meeting {
  _id: string;
  companyId: string;
  title: string;
  summary: string;
  actionItems: ActionItem[];
  projectId?: { _id: string; name: string };
  createdBy: { _id: string; name: string };
  createdAt?: string;
}

export interface Client {
  _id: string;
  companyId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Revenue {
  _id: string;
  companyId: string;
  projectId?: { _id: string; name: string };
  clientId?: { _id: string; name: string; companyName: string };
  title: string;
  amount: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  paidDate?: string;
}

export interface DashboardStats {
  cards: {
    totalEmployees: number;
    totalProjects: number;
    activeTasks: number;
    totalRevenue: number;
    pendingPayments: number;
  };
  charts: {
    revenueChart: { month: string; paid: number; pending: number }[];
    projectStatusChart: { name: string; value: number }[];
    employeeWorkloadChart: { employeeName: string; taskCount: number }[];
  };
}

export interface AnalyticsData {
  projectCompletion: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    completionRate: number;
  };
  employeeUtilization: {
    totalEmployees: number;
    totalActiveTasks: number;
    avgTaskPerEmployee: string;
  };
  taskPerformance: {
    total: number;
    overdue: number;
    onTimeActive: number;
    completedOnTime: number;
    overduePercentage: number;
  };
  financialSummary: {
    paidTotal: number;
    pendingTotal: number;
    overdueTotal: number;
  };
}

export interface ProjectRiskReport {
  projectId: string;
  projectName: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskScore: number;
  factors: string[];
  recommendedAction: string;
}

export interface RevenueForecast {
  historicalMonthlyAverage: number;
  projectedNextMonthRevenue: number;
  projectedQuarterRevenue: number;
  confidenceScore: number;
  growthRate: number;
  note: string;
}
