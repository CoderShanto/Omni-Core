# Software Requirements Specification (SRS)
## Multi-Company Management & AI-Driven Business Intelligence System

**Version:** 1.0
**Prepared for:** Sprint-based development (MERN + TypeScript stack)
**Status:** Draft — aligned with completed Phase 1 foundation (MongoDB, Express, User CRUD, React Dashboard)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for a **multi-tenant company management platform** that allows multiple companies to independently manage their users, employees, projects, tasks, clients, revenue, and internal knowledge — with a role-based hierarchy (Super Admin → CEO → Manager → Employee) and an AI-assisted decision layer for company leadership.

### 1.2 Scope
The system will provide:
- Secure authentication and role-based access control across company boundaries
- Company and employee management
- Project and task tracking with status workflows
- Internal knowledge storage (notes, meeting minutes)
- Revenue and client tracking
- A CEO-facing dashboard with visual analytics
- An AI layer providing insights, risk detection, and revenue forecasting

The system is web-based, built on a React/TypeScript frontend and a Node.js/Express/TypeScript backend with MongoDB as the primary datastore.

### 1.3 Intended Audience
Developers, project stakeholders, and whoever is running sprint planning for this build (this document is meant to be the reference every module is checked against).

### 1.4 Definitions
| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| JWT | JSON Web Token, used for stateless authentication |
| RBAC | Role-Based Access Control |
| Tenant | A single Company record and everything scoped under it |
| COO Layer | The AI insight/analytics layer described in Phase 8 |

---

## 2. Overall Description

### 2.1 Product Perspective
This is a **multi-tenant SaaS-style internal system**: one deployed instance serves many companies, each with isolated data (employees, projects, revenue) but a shared codebase and shared authentication/role infrastructure. A Super Admin operates above all companies; each Company has its own CEO, Managers, and Employees.

### 2.2 Product Functions (Summary)
1. Authentication & Role Management
2. Company Management
3. Employee Management
4. Project & Task Management
5. Knowledge Base (Notes & Meeting Notes)
6. Revenue & Client Management
7. CEO Dashboard (cards + charts)
8. Analytics Layer
9. AI Insight Layer (insights, risk detection, forecasting)

### 2.3 User Roles & Permission Levels

| Role | Scope | Typical Permissions |
|---|---|---|
| **Super Admin** | Global (all companies) | Create/manage companies, manage all roles, system-wide settings, no company-specific work |
| **CEO** | Single company | Full visibility into their company: employees, projects, revenue, dashboard, AI insights |
| **Manager** | Assigned projects/team within a company | Create/assign projects and tasks, view team workload, cannot see company revenue/financials unless granted |
| **Employee** | Self-scoped | View/update assigned tasks, view own profile, submit notes |

### 2.4 Operating Environment
- **Frontend:** React + TypeScript + TailwindCSS + React Router + Axios
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT + bcrypt password hashing
- **Architecture pattern:** Route → Controller → Service → Model

### 2.5 Design & Implementation Constraints
- All company-scoped data (employees, projects, tasks, revenue, clients, notes) must be filtered by `companyId` at the query layer — no cross-tenant data leakage.
- Role checks must be enforced via middleware, not just hidden in the UI.
- Passwords stored only as bcrypt hashes, never plaintext.
- JWT tokens should carry `userId`, `role`, and `companyId` claims (where applicable) to avoid repeated DB lookups on every request.

---

## 3. Functional Requirements (by Phase)

### Phase 1 — Foundation

**Module 1.1: Authentication**
| ID | Requirement |
|---|---|
| FR-1.1.1 | System shall allow a new user to register with name, email, password |
| FR-1.1.2 | Passwords shall be hashed using bcrypt before storage |
| FR-1.1.3 | System shall allow login via email + password, returning a signed JWT |
| FR-1.1.4 | System shall allow logout (client-side token invalidation / blacklist if applicable) |
| FR-1.1.5 | System shall reject requests with missing, expired, or invalid JWTs on protected routes |

**Module 1.2: Role System**
| ID | Requirement |
|---|---|
| FR-1.2.1 | System shall support four fixed roles: Super Admin, CEO, Manager, Employee |
| FR-1.2.2 | Super Admin shall be able to create and assign roles to users |
| FR-1.2.3 | System shall enforce role checks via Express middleware on every protected route |
| FR-1.2.4 | System shall deny access with a 403 response when a role lacks permission for an action |

### Phase 2 — Company Management

**Module 2.1: Company**
| ID | Requirement |
|---|---|
| FR-2.1.1 | System shall store Company Name, Industry, Address, Email, Phone |
| FR-2.1.2 | Super Admin shall be able to create a new company record |
| FR-2.1.3 | CEO/Super Admin shall be able to update company details |
| FR-2.1.4 | Authorized roles shall be able to view company profile/details |

**Module 2.2: Employee**
| ID | Requirement |
|---|---|
| FR-2.2.1 | System shall store Name, Email, Designation, Department, Salary, Join Date per employee |
| FR-2.2.2 | CEO/Manager shall be able to add a new employee under their company |
| FR-2.2.3 | CEO/Manager shall be able to update employee details |
| FR-2.2.4 | System shall provide an individual Employee Profile view |

### Phase 3 — Project Management

**Module 3.1: Projects**
| ID | Requirement |
|---|---|
| FR-3.1.1 | System shall store Name, Description, Budget, Deadline, Status per project |
| FR-3.1.2 | Project status shall be one of: Pending, In Progress, Completed, Cancelled |
| FR-3.1.3 | Manager/CEO shall be able to create a project |
| FR-3.1.4 | Manager shall be able to assign a team (one or more employees) to a project |
| FR-3.1.5 | Manager/CEO shall be able to update project status |

**Module 3.2: Tasks**
| ID | Requirement |
|---|---|
| FR-3.2.1 | System shall store Title, Description, Priority, Deadline, Status, Assigned User per task |
| FR-3.2.2 | Priority shall be one of: Low, Medium, High, Critical |
| FR-3.2.3 | Task status shall be one of: Todo, Doing, Review, Done |
| FR-3.2.4 | Manager shall be able to create and assign tasks to employees |
| FR-3.2.5 | Assigned employee shall be able to update their task's status |

### Phase 4 — Knowledge System

**Module 4.1: Notes**
| ID | Requirement |
|---|---|
| FR-4.1.1 | System shall store Title, Content, Tags per note |
| FR-4.1.2 | Any authenticated company member shall be able to create a note scoped to their company |

**Module 4.2: Meeting Notes**
| ID | Requirement |
|---|---|
| FR-4.2.1 | System shall store Meeting Title, Summary, Action Items |
| FR-4.2.2 | Manager/CEO shall be able to log meeting notes tied to a project or company |

### Phase 5 — Revenue Management

**Module 5.1: Clients**
| ID | Requirement |
|---|---|
| FR-5.1.1 | System shall store Name, Company, Email, Phone per client |
| FR-5.1.2 | CEO/Manager shall be able to create/manage client records |

**Module 5.2: Revenue**
| ID | Requirement |
|---|---|
| FR-5.2.1 | System shall store Project reference, Amount, Payment Status, Due Date per revenue entry |
| FR-5.2.2 | Payment Status shall be one of: Paid, Pending, Overdue |
| FR-5.2.3 | CEO shall have full visibility into all revenue entries for their company |

### Phase 6 — Dashboard

| ID | Requirement |
|---|---|
| FR-6.1 | Dashboard shall display cards for: Total Employees, Total Projects, Active Tasks, Revenue, Pending Payments |
| FR-6.2 | Dashboard shall display a Revenue Chart (trend over time) |
| FR-6.3 | Dashboard shall display a Project Status Chart (distribution by status) |
| FR-6.4 | Dashboard shall display an Employee Workload Chart (tasks per employee) |
| FR-6.5 | Dashboard data shall be scoped strictly to the logged-in CEO's company |

### Phase 7 — Analytics

| ID | Requirement |
|---|---|
| FR-7.1 | System shall calculate Project Completion Rate (completed / total projects) |
| FR-7.2 | System shall calculate Employee Utilization (active task load per employee) |
| FR-7.3 | System shall show Revenue Trend over selectable time ranges |
| FR-7.4 | System shall show Task Performance metrics (on-time vs overdue completion) |

### Phase 8 — AI Layer ("AI COO")

| ID | Requirement |
|---|---|
| FR-8.1 | System shall provide a natural-language query interface for the CEO (e.g., "What should I focus on today?") |
| FR-8.2 | System shall generate AI-driven risk flags per project (e.g., "Project Alpha risk: High") based on deadline slippage, task overdue rate, or budget variance |
| FR-8.3 | System shall generate a revenue forecast for the upcoming period based on historical revenue data |
| FR-8.4 | AI outputs shall be clearly labeled as generated/estimated, not guaranteed figures |

---

## 4. Data Model Overview (MongoDB Collections)

| Collection | Key Relationships |
|---|---|
| `users` | Belongs to a `company` (except Super Admin); has a `role` |
| `roles` | Referenced by `users` |
| `companies` | Root tenant entity; owns employees, projects, clients, revenue, notes |
| `employees` | Belongs to `company`; may map 1:1 to a `user` |
| `projects` | Belongs to `company`; has assigned `employees` (team) |
| `tasks` | Belongs to `project`; assigned to one `employee` |
| `clients` | Belongs to `company` |
| `revenues` | Belongs to `company`; references a `project` |
| `notes` | Belongs to `company`; created by a `user` |
| `meetings` | Belongs to `company`; optionally linked to a `project` |

**Tenant isolation rule:** every query against `employees`, `projects`, `tasks`, `clients`, `revenues`, `notes`, `meetings` must filter by `companyId` derived from the authenticated user's JWT — never trust a `companyId` passed in the request body/query string alone.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | JWT expiry + refresh strategy; bcrypt cost factor ≥ 10; role + tenant checks on every protected route |
| Performance | Dashboard aggregate queries should be indexed on `companyId` and date fields used for charts |
| Scalability | Schema and queries must support many companies without cross-tenant performance degradation |
| Usability | Role-appropriate UI — Employees should not see Manager/CEO-only screens even if they guess the URL |
| Maintainability | Consistent Route → Controller → Service → Model layering per your existing architecture |
| Auditability | Consider timestamping all create/update actions (`createdAt`/`updatedAt` on every collection) for later audit/analytics needs |

---

## 6. External Interface Requirements

- **API:** RESTful JSON endpoints (`/api/auth`, `/api/companies`, `/api/employees`, `/api/projects`, `/api/tasks`, `/api/clients`, `/api/revenues`, `/api/notes`, `/api/meetings`, `/api/dashboard`, `/api/analytics`, `/api/ai`)
- **Frontend:** React SPA consuming the above via Axios, with protected routes gated by role from the decoded JWT
- **AI Layer (Phase 8):** Likely a separate service/endpoint (`/api/ai/insights`, `/api/ai/risk`, `/api/ai/forecast`) that reads aggregated data rather than raw collections directly

---

## 7. Traceability to Current Sprint

Per your current position, Phase 1 foundation work (MongoDB connection, Express server, TypeScript setup, User model/CRUD, React dashboard, Axios wiring) maps to **FR-1.1** and part of **FR-1.2**. Your next sprint items map directly to:

- Register → FR-1.1.1, FR-1.1.2
- Login → FR-1.1.3
- JWT → FR-1.1.3, FR-1.1.5
- bcrypt → FR-1.1.2
- Protected Route → FR-1.1.5
- Role Model → FR-1.2.1
- Role Middleware → FR-1.2.3, FR-1.2.4

This SRS can serve as the checklist for each sprint going forward — as you complete a module, its FR rows above are what "done" should be verified against.
