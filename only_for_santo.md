# Multi-Company Management & AI-Driven Business Intelligence SaaS Platform

> **Comprehensive Developer & Product Documentation**  
> *Prepared specifically for Santo — GitHub Ready Edition*

---

## 🌟 Executive Summary

This platform is a **production-grade, multi-tenant SaaS application** built for enterprise company management, operational task tracking, financial ledgers, and AI-driven business intelligence. 

It enables multiple companies (tenants) to operate independently within a single software deployment with strict database tenant isolation (`companyId`), role-based access control (Super Admin, CEO, Manager, Employee), custom SaaS subscription billing tiers, real-time time tracking & expenses, SOC2 security audit logging, and an **"AI COO" Layer** that provides natural language assistance, project risk detection, and predictive revenue forecasting.

---

## 🏗️ Technical Architecture & Stack

### Backend Stack (`server/`)
- **Runtime**: Node.js + Express
- **Language**: TypeScript (strict mode enabled)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + `bcryptjs` password hashing (cost factor 10)
- **Security & RBAC**: Custom Express middlewares (`authMiddleware`, `roleMiddleware`, `quotaMiddleware`)
- **API Standard**: RESTful JSON API with unified error handling

### Frontend Stack (`client/`)
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Tailwind HSL Design System, modern dark mode glassmorphism)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Area Charts, Pie Charts, Bar Charts)
- **HTTP Client**: Axios with request/response JWT bearer interceptors
- **Routing**: React Router DOM (v6) with Protected Route wrappers

---

## 📁 Complete Directory Structure

```
f:/F-SANTO DREAM/
├── README.md                      # General system overview
├── only_for_santo.md              # Full developer & deployment guide
├── SRS_Company_Management_System.md # Software Requirements Specification
├── server/                        # Express Backend REST API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                       # Environment variables
│   └── src/
│       ├── config/
│       │   └── db.ts              # MongoDB database connection
│       ├── models/                # Mongoose Models & TypeScript Interfaces
│       │   ├── User.ts            # Users & Role definitions
│       │   ├── Company.ts         # Company tenant records & white-labeling
│       │   ├── Employee.ts        # Employee roster, salaries & departments
│       │   ├── Project.ts         # Project deliverables & budgets
│       │   ├── Task.ts            # Tasks & Kanban statuses
│       │   ├── Note.ts            # Knowledge notes & tags
│       │   ├── Meeting.ts         # Meeting minutes & checklists
│       │   ├── Client.ts          # Client directory
│       │   ├── Revenue.ts         # Invoices & financial ledgers
│       │   ├── Subscription.ts    # SaaS billing plans & quotas
│       │   ├── TimeLog.ts         # Time tracking & billable hours
│       │   ├── Expense.ts         # Employee expense claims
│       │   └── AuditLog.ts        # SOC2 security activity trail
│       ├── middlewares/
│       │   ├── authMiddleware.ts  # JWT bearer token verification
│       │   ├── roleMiddleware.ts  # Role-based access control (403 Forbidden)
│       │   ├── quotaMiddleware.ts # Subscription plan seat & project limits
│       │   └── errorMiddleware.ts # Express error handler
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── companyController.ts
│       │   ├── employeeController.ts
│       │   ├── projectController.ts
│       │   ├── taskController.ts
│       │   ├── noteController.ts
│       │   ├── meetingController.ts
│       │   ├── clientController.ts
│       │   ├── revenueController.ts
│       │   ├── dashboardController.ts
│       │   ├── analyticsController.ts
│       │   ├── aiController.ts
│       │   ├── billingController.ts
│       │   ├── timeLogController.ts
│       │   ├── expenseController.ts
│       │   └── auditLogController.ts
│       ├── services/
│       │   └── aiService.ts       # AI risk assessor, revenue forecast engine & natural Q&A
│       ├── routes/                # REST API route endpoints
│       ├── seed.ts                # Database seeder script
│       └── server.ts              # Express application entry point
└── client/                        # React + Vite Frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── api/
        │   └── axios.ts           # Axios instance with JWT interceptor
        ├── context/
        │   └── AuthContext.tsx    # Auth session state provider
        ├── types/
        │   └── index.ts           # TypeScript interfaces for frontend
        ├── components/
        │   ├── Sidebar.tsx        # Role-based navigation sidebar
        │   ├── Navbar.tsx         # Header navbar with user profile & logout
        │   ├── ProtectedRoute.tsx # Route guard wrapper
        │   ├── StatCard.tsx       # Executive metric cards
        │   └── Modal.tsx          # Reusable modal dialog
        ├── pages/
        │   ├── Login.tsx          # Login with quick demo buttons
        │   ├── Register.tsx       # User registration
        │   ├── Dashboard.tsx      # CEO Executive Control Center
        │   ├── Companies.tsx      # Company Tenant Directory
        │   ├── Employees.tsx      # Employee Roster & Profiles
        │   ├── Projects.tsx       # Project Workflows
        │   ├── Tasks.tsx          # Task Kanban Board
        │   ├── Operations.tsx     # Stopwatch Timer & Expenses
        │   ├── Knowledge.tsx      # Company Notes & Meeting Minutes
        │   ├── Revenue.tsx        # Client Directory & Invoice Ledger
        │   ├── Analytics.tsx      # Business Intelligence Metrics
        │   ├── AICOO.tsx          # AI COO Intelligence Layer
        │   ├── Billing.tsx        # SaaS Subscriptions & Quota Meters
        │   └── SecurityAudit.tsx  # SOC2 Audit Trail & White-Labeling
        ├── App.tsx                # App router setup
        ├── main.tsx               # DOM renderer
        └── index.css              # Custom CSS design system
```

---

## 🛠️ System Requirements (Prerequisites)

Before running the application, make sure you have the following installed on your machine:

1. **Node.js**: `v18.x` or `v20.x` installed ([nodejs.org](https://nodejs.org/))
2. **npm**: `v9.x` or `v10.x` (comes bundled with Node.js)
3. **MongoDB**:
   - Local MongoDB Community Server running at `mongodb://127.0.0.1:27017/company_management`
   - **OR** MongoDB Atlas Connection String (set in `server/.env`)
4. **Git**: Installed for version control ([git-scm.com](https://git-scm.com/))

---

## ⚡ How to Install, Seed, and Run the System

Follow these step-by-step instructions to get the application running locally in 2 simple steps:

### Step 1: Set Up & Launch Backend API Server

Open a terminal window and execute:

```bash
# Navigate into backend server directory
cd server

# Install Node.js dependencies
npm install

# (Optional) Seed MongoDB database with pre-configured demo tenants & data
npm run seed

# Start Express TypeScript server in development mode
npm run dev
```

> **Backend Status**: Server will start running at **`http://localhost:5000`**.  
> Database connection string is loaded from `server/.env`.

### Step 2: Set Up & Launch Frontend Client App

Open a **second terminal window** and execute:

```bash
# Navigate into frontend client directory
cd client

# Install frontend dependencies
npm install

# Launch Vite React development server
npm run dev
```

> **Frontend Status**: Client app will launch at **`http://localhost:3000`**.  
> Open your browser and visit **`http://localhost:3000`**.

---

## 🔑 Pre-Configured Demo Credentials

The database seed script (`npm run seed`) automatically populates test tenants, accounts, projects, tasks, invoices, time logs, and audit logs.

> **Default Password for ALL Accounts:** `Password123!`

| Role | Email | Tenant Company | Scope |
|---|---|---|---|
| 👑 **Super Admin** | `admin@platform.com` | Global System | All companies & global settings |
| 💼 **CEO (Apex)** | `ceo@apex.com` | Apex Tech Solutions | Single-tenant executive control |
| 👔 **Manager (Apex)** | `manager@apex.com` | Apex Tech Solutions | Department & project management |
| 👷 **Employee (Apex)**| `dev@apex.com` | Apex Tech Solutions | Task execution & timesheets |
| 💼 **CEO (Horizon)** | `ceo@horizon.com` | Horizon Media Group | Isolated second tenant company |

*Tip: On the Login screen, click any of the 4 quick demo role buttons to log in instantly without typing credentials!*

---

## 📊 Modules & Capabilities Deep Dive

### 1. 🔐 Multi-Tenant Security & Role-Based Access Control (RBAC)
- **Tenant Isolation**: Database queries enforce `companyId` filtering extracted directly from verified JWT claims. Cross-tenant query execution is blocked.
- **Roles**:
  - `Super Admin`: Create tenants, manage all roles, global system settings.
  - `CEO`: Full company visibility into roster, projects, task boards, financial ledgers, dashboard, analytics, and AI COO.
  - `Manager`: Manage team members, create projects/tasks, log meeting notes, manage clients, approve expenses.
  - `Employee`: View assigned tasks, move tasks on Kanban board, log worked hours, submit expenses, submit notes.

### 2. 💳 SaaS Subscription Billing & Quota Engine (`/billing`)
- **Plan Tiers**:
  - **Starter**: `$49/mo` (10 seats, 25 projects, 200 AI queries)
  - **Business**: `$199/mo` (50 seats, 100 projects, 1,000 AI queries)
  - **Enterprise**: `$499/mo` (Unlimited seats, projects, AI queries)
- **Quota Middleware**: `quotaMiddleware.ts` blocks user registration or project creation if tenant exceeds plan quota limits, returning HTTP 403 with upgrade instructions.

### 3. ⏱️ Time Tracking & Employee Expense Operations (`/operations`)
- **Live Task Stopwatch Widget**: Interactive timer (`Start Timer` / `Stop & Save`) for real-time task logging.
- **Billable Labor Calculator**: Computes total worked hours and billable values vs hourly rates.
- **Expense Approvals**: Categories (*Office*, *Software*, *Travel*, *Hardware*, *Marketing*) with Manager/CEO `Approve` / `Reject` actions.

### 4. 🛡️ SOC2 Security Audit Trail & White-Labeling (`/security-audit`)
- **SOC2 Audit Trail**: Immutable logging of user activities (`userEmail`, `role`, `action`, `target entity`, `IP address`, `timestamp`).
- **White-Label Configurator**: Custom logo URL, primary accent color picker, and custom tenant subdomain binding.

### 5. 🤖 AI COO Intelligence Layer (`/ai-coo`)
- **Executive Assistant**: Natural language query processor answering executive questions ("What should I focus on today?").
- **Project Risk Detector**: Scores project risk levels (`High`, `Medium`, `Low`) based on deadline proximity and overdue task ratios.
- **Revenue Forecast Engine**: Predictive trend calculation projecting upcoming monthly and quarterly earnings with confidence scores.

### 6. 📈 Executive Dashboard & BI Analytics (`/dashboard`, `/analytics`)
- **Executive Dashboard**: Cards for Total Employees, Active Projects, Active Tasks, Total Revenue, Pending Receivables.
- **Visual Analytics**: Interactive Recharts for Revenue Trends, Project Status Distribution, Employee Workload, and Task Completion Rates.

---

## 📦 How to Upload to GitHub

Follow these steps to upload this project to your GitHub repository:

```bash
# 1. Initialize Git repository in project root
git init

# 2. Add files to staging
git add .

# 3. Commit changes
git commit -m "Initial commit: Production Multi-Company Management & AI BI SaaS Platform"

# 4. Rename main branch
git branch -M main

# 5. Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🌟 Summary

You now possess a complete, enterprise-ready, multi-tenant B2B SaaS platform equipped with authentication, tenant isolation, role management, interactive Kanban boards, financial ledgers, executive analytics, SaaS billing quotas, time tracking, expense approvals, security audit logs, and an AI COO layer.
