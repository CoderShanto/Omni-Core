# Software Requirements Specification (SRS)
## AI COO — Multi-Tenant Executive Operations Platform

**Version:** 2.0 (supersedes v1.0 — role model revised, AI Executive Layer expanded)
**Prepared for:** Product development ahead of commercial launch
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for a **multi-tenant company operations platform with an embedded AI Executive layer ("AI COO")**. The platform lets a company's leadership manage people, projects, revenue, and knowledge in one place, while the AI layer converts that operational data into daily, trustworthy recommendations — not just dashboards.

This version corrects a scoping error from v1.0: role authority within a company belongs to that company's **CEO alone**. The platform owner (Super Admin) provisions and bills tenants but has no authority to create, assign, or modify roles inside any customer's company.

### 1.2 Scope
The platform will provide, per company (tenant):
- Company-owned role management (CEO decides Manager/Employee assignments — not the platform operator)
- Employee, project, and task management
- Internal knowledge (notes, meetings) with AI-powered retrieval
- Client and revenue tracking
- An executive dashboard built around a single Business Health Score, not raw charts
- A full AI Executive layer: daily briefings, risk prediction, workload/burnout detection, revenue leak detection, natural-language company search, an AI CEO chat, a knowledge graph, and a decision simulator
- Enterprise-grade security and trust features (audit logs, SSO, 2FA, white-labeling, data export, session/device management, API keys, backups)

### 1.3 Intended Audience
Founders/product owner, engineering team, and (in later revisions) prospective enterprise customers evaluating the platform during procurement.

### 1.4 Definitions
| Term | Meaning |
|---|---|
| Tenant | One Company record and everything scoped under it — fully isolated from other tenants |
| Platform Owner / Super Admin | The operator of the SaaS platform itself (you, the startup) — manages billing and tenant provisioning only |
| CEO | The account that owns a tenant; the sole authority over that tenant's internal roles |
| AI COO | The AI Executive layer: recommendations, risk detection, forecasting, chat, knowledge search |
| RAG | Retrieval-Augmented Generation — AI answering questions by retrieving the company's own documents/notes/meetings first |
| Business Health Score | A single composite metric summarizing finance, projects, people, and operations for a company |

### 1.5 Business Context
Per the product thesis this SRS is built from: the durable advantage here isn't more CRUD screens than competitors — it's turning the operational data the platform already collects (projects, tasks, revenue, notes, meetings) into timely, trustworthy recommendations a CEO or manager can act on with less effort. Every AI feature in this document should be justified against that thesis, not added as a novelty.

---

## 2. Overall Description

### 2.1 Product Perspective
A single deployed platform serves many independent companies (tenants). Each tenant's data — employees, projects, tasks, revenue, clients, notes, meetings — is fully isolated. The **platform owner never has operational authority inside a tenant**; their role is infrastructure and billing, not company management.

### 2.2 Revised Role Model (Critical Change from v1.0)

| Role | Who controls it | Scope | Can assign other roles? |
|---|---|---|---|
| **Super Admin (Platform Owner)** | The startup operating the SaaS | Cross-tenant: provisioning, billing, uptime, platform-level security | **No** — cannot create/assign/modify Manager or Employee roles inside any company, and cannot act as a CEO |
| **CEO** | Created once per company at signup/provisioning | Full authority over their own company only | **Yes** — the CEO is the only role that can create, assign, reassign, or revoke Manager and Employee roles within their company |
| **Manager** | Assigned by their company's CEO | Assigned projects/teams within that company | No — cannot create or assign roles |
| **Employee** | Assigned by their company's CEO (directly, or via a Manager if the CEO delegates that permission explicitly) | Self-scoped: own tasks, own profile | No |

**Key principle:** the Super Admin's only touchpoint with a tenant is creating the tenant and its first CEO account (during onboarding/sales), suspending/reactivating a tenant for billing reasons, and platform-wide monitoring. Every other decision about who does what inside a company belongs to that company's CEO. This is what makes the product trustworthy to sell to a real business — a customer's org chart is theirs to control, not the vendor's.

### 2.3 Operating Environment
- **Frontend:** React + TypeScript + TailwindCSS + React Router + Axios
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (claims: `userId`, `role`, `companyId`) + bcrypt
- **AI Layer:** Retrieval-augmented service reading aggregated/indexed company data (not raw collection dumps) to produce insights, forecasts, and chat responses

### 2.4 Design Constraints
- Every tenant-scoped query (`employees`, `projects`, `tasks`, `clients`, `revenues`, `notes`, `meetings`, `invoices`) must filter by `companyId` taken from the authenticated JWT — never from a client-supplied parameter.
- Role-assignment endpoints must verify the acting user is the CEO **of that specific company** — a CEO of Company A must never be able to assign roles in Company B.
- The Super Admin's API surface must be entirely separate from company-internal role-management endpoints, ideally on a distinct route namespace (e.g. `/api/platform/*` vs `/api/company/*`) so the separation is structural, not just a permission check.

---

## 3. Functional Requirements

### Phase 1 — Foundation & Identity

**Module 1.1 Authentication**
| ID | Requirement |
|---|---|
| FR-1.1.1 | System shall allow registration (name, email, password) |
| FR-1.1.2 | Passwords stored only as bcrypt hashes |
| FR-1.1.3 | Login returns a signed JWT containing `userId`, `role`, `companyId` |
| FR-1.1.4 | Logout invalidates the session client-side (and server-side session/token blacklist if implemented) |
| FR-1.1.5 | Protected routes reject missing/expired/invalid JWTs |
| FR-1.1.6 | 2FA shall be available as an optional (and, for enterprise tenants, enforceable) login step |

**Module 1.2 Role & Tenant System (Revised)**
| ID | Requirement |
|---|---|
| FR-1.2.1 | Super Admin shall be able to provision a new Company (tenant) and its initial CEO account only |
| FR-1.2.2 | Super Admin shall have **no** endpoint or UI capability to create, assign, or modify Manager/Employee roles in any tenant |
| FR-1.2.3 | CEO shall be the sole authority able to create, assign, reassign, or revoke Manager and Employee roles within their own company |
| FR-1.2.4 | CEO may optionally delegate limited "invite Employee" ability to a Manager, but role *type* assignment (Manager vs Employee) remains CEO-only unless explicitly reconfigured by the CEO |
| FR-1.2.5 | All role-management actions shall be middleware-checked against both the acting user's role AND their `companyId` matching the target record's `companyId` |
| FR-1.2.6 | Every role change shall be written to the company's audit log (who changed what, when) |

### Phase 2 — Company & People Management

**Module 2.1 Company**
| ID | Requirement |
|---|---|
| FR-2.1.1 | Store Company Name, Industry, Address, Email, Phone |
| FR-2.1.2 | CEO shall be able to update their own company's profile |
| FR-2.1.3 | Super Admin may suspend/reactivate a tenant (billing enforcement only) but not edit its internal data |

**Module 2.2 Employee**
| ID | Requirement |
|---|---|
| FR-2.2.1 | Store Name, Email, Designation, Department, Salary, Join Date |
| FR-2.2.2 | CEO (or Manager, if delegated) may add/update employee records within their own company |
| FR-2.2.3 | System provides an Employee Profile view scoped to the employee's own company |

### Phase 3 — Project & Task Management

**Module 3.1 Projects**
| ID | Requirement |
|---|---|
| FR-3.1.1 | Store Name, Description, Budget, Deadline, Status (Pending / In Progress / Completed / Cancelled) |
| FR-3.1.2 | Manager/CEO may create a project and assign a team |
| FR-3.1.3 | Manager/CEO may update project status |

**Module 3.2 Tasks**
| ID | Requirement |
|---|---|
| FR-3.2.1 | Store Title, Description, Priority (Low/Medium/High/Critical), Deadline, Status (Todo/Doing/Review/Done), Assigned User |
| FR-3.2.2 | Manager creates and assigns tasks; assigned Employee updates status |
| FR-3.2.3 | System shall proactively detect approaching/missed deadlines and trigger notifications (see Module 9.12) rather than relying on the employee to check |

### Phase 4 — Knowledge System

**Module 4.1 Notes** — Title, Content, Tags; any authenticated company member may create, scoped to their company.

**Module 4.2 Meeting Notes** — Meeting Title, Summary, Action Items; Manager/CEO may log, optionally linked to a project.

### Phase 5 — Revenue Management

**Module 5.1 Clients** — Name, Company, Email, Phone; CEO/Manager manage records.

**Module 5.2 Revenue / Invoices**
| ID | Requirement |
|---|---|
| FR-5.2.1 | Store Project reference, Amount, Payment Status (Paid/Pending/Overdue), Due Date |
| FR-5.2.2 | CEO has full visibility into all revenue/invoice data for their company |
| FR-5.2.3 | System shall flag invoices approaching or past due date automatically |

### Phase 6 — Executive Dashboard

| ID | Requirement |
|---|---|
| FR-6.1 | Dashboard leads with a single **Business Health Score** (see FR-9.4), not raw cards alone |
| FR-6.2 | Dashboard shows supporting cards: Total Employees, Total Projects, Active Tasks, Revenue, Pending Payments |
| FR-6.3 | Dashboard shows Revenue Chart, Project Status Chart, Employee Workload Chart |
| FR-6.4 | All dashboard data strictly scoped to the logged-in user's company |

### Phase 7 — Analytics

| ID | Requirement |
|---|---|
| FR-7.1 | Project Completion Rate |
| FR-7.2 | Employee Utilization / workload distribution |
| FR-7.3 | Revenue Trend over selectable ranges |
| FR-7.4 | Task Performance (on-time vs overdue) |

### Phase 8 — Smart Notifications

| ID | Requirement |
|---|---|
| FR-8.1 | System shall detect at-risk deadlines (e.g., "task due tomorrow, not started") and push notifications across configured channels: Slack, Email, WhatsApp, in-app |
| FR-8.2 | Notification channel preferences shall be configurable per user and per company |

### Phase 9 — AI Executive Layer ("AI COO")

This is the platform's core differentiator and should be scoped as carefully as the role model above.

**Module 9.1 AI COO Dashboard**
| ID | Requirement |
|---|---|
| FR-9.1.1 | Provide a "Today's Company Status" view: revenue movement, burnout signals, overdue invoices, top project risks |
| FR-9.1.2 | Provide ranked "Suggested Actions" (e.g., "Call Client ABC", "Move John to Project Beta", "Delay Feature X") — each action shall cite the underlying data point that triggered it |

**Module 9.2 Company Knowledge AI (RAG Search)**
| ID | Requirement |
|---|---|
| FR-9.2.1 | Allow natural-language queries across notes, meetings, documents, tasks, and decisions (e.g., "Where is the client contract?") |
| FR-9.2.2 | Responses shall include source attribution (which document/note/meeting, and date) rather than an unsourced answer |
| FR-9.2.3 | Search/answers shall be scoped strictly to the requesting user's company |

**Module 9.3 CEO Daily/Weekly Briefings**
| ID | Requirement |
|---|---|
| FR-9.3.1 | Auto-generate a daily and/or weekly summary of company activity, delivered via email and/or in-app |
| FR-9.3.2 | Briefing shall highlight what changed since the last briefing, not just current-state totals |

**Module 9.4 Business Health Score**
| ID | Requirement |
|---|---|
| FR-9.4.1 | Compute one composite score from finance, project, people, and operations sub-scores |
| FR-9.4.2 | Score shall be explainable — clicking it shows which sub-scores are dragging it down |

**Module 9.5 Project Risk Prediction**
| ID | Requirement |
|---|---|
| FR-9.5.1 | Flag project risk level (e.g., Low/Medium/High) based on deadline slippage, overdue task rate, and budget variance |
| FR-9.5.2 | Explain *why* a project is flagged, and suggest at least one corrective action |

**Module 9.6 Workload & Burnout Detection**
| ID | Requirement |
|---|---|
| FR-9.6.1 | Track workload signals per employee: task count, overtime, deadline pressure, working hours |
| FR-9.6.2 | Flag employees at risk of overload and suggest task redistribution to underutilized team members |

**Module 9.7 Revenue Leak Detection**
| ID | Requirement |
|---|---|
| FR-9.7.1 | Identify unpaid/overdue invoices, stalled projects with billable work, and missed client follow-ups |
| FR-9.7.2 | Surface these as actionable items on the AI COO Dashboard, not buried in a report |

**Module 9.8 AI CEO Chat**
| ID | Requirement |
|---|---|
| FR-9.8.1 | Allow free-text questions (e.g., "Why did revenue drop?") answered with specific, cited causes (e.g., a named client stopped payments, a named project is delayed) drawn from the company's own data |
| FR-9.8.2 | Chat shall decline to answer with fabricated specifics when the underlying data doesn't support a confident answer, and say so plainly |

**Module 9.9 AI Company Memory / Knowledge Graph**
| ID | Requirement |
|---|---|
| FR-9.9.1 | Model relationships between Employee, Project, Meeting, Task, Client, Revenue, and Decision entities — not just flat storage |
| FR-9.9.2 | Support queries like "What was decided about the payment gateway?" answered instantly with the connected decision/meeting/document |

**Module 9.10 AI Decision Simulator**
| ID | Requirement |
|---|---|
| FR-9.10.1 | Allow "what-if" queries (e.g., "What happens if we hire two developers?") |
| FR-9.10.2 | Return a projected effect on completion timeline, revenue, and cost, clearly labeled as an estimate |

**Module 9.11 Natural Language Company Search**
| ID | Requirement |
|---|---|
| FR-9.11.1 | Support structured questions in plain language (e.g., "Which projects are over budget?", "Show employees with the highest workload") without requiring the user to build a filter UI |

### Phase 10 — Enterprise Trust & Security

Positioned as a core sales requirement, not an afterthought — enterprise buyers will ask about these during procurement.

| ID | Requirement |
|---|---|
| FR-10.1 | Audit Logs — every sensitive action (role change, data export, login) recorded with actor, timestamp, target |
| FR-10.2 | SSO support (SAML/OAuth) for enterprise tenants |
| FR-10.3 | 2FA, optionally enforceable company-wide by the CEO |
| FR-10.4 | White-labeling — tenant branding on login/dashboard for enterprise plans |
| FR-10.5 | Data export (company's own data, in a portable format) |
| FR-10.6 | Device History / recent login devices visible to each user |
| FR-10.7 | Session Management — view and revoke active sessions |
| FR-10.8 | API Key Management for tenants integrating externally |
| FR-10.9 | Company Security Score — a visible, improvable metric (2FA adoption, session hygiene, etc.) |
| FR-10.10 | Sensitive Data Access Logs — who viewed revenue/salary/client data and when |
| FR-10.11 | Automatic Backups with point-in-time restore |

### Phase 11 — Focus Mode & Time Tracking

| ID | Requirement |
|---|---|
| FR-11.1 | Task-level timer (basic time tracking) |
| FR-11.2 | "Focus Mode" — when enabled, mutes Slack/email notifications, starts a task timer / Pomodoro cycle |
| FR-11.3 | On session end, show a Focus Score (e.g., deep work hours vs distractions/interruptions) |

---

## 4. Data Model Overview (MongoDB Collections)

| Collection | Notes |
|---|---|
| `users` | Has `role`, `companyId` (null/none for Super Admin) |
| `companies` | Root tenant entity |
| `employees` | Belongs to `company`; created only via CEO (or CEO-delegated Manager) |
| `projects`, `tasks` | Belong to `company`; tasks reference `project` and assigned `employee` |
| `clients`, `revenues`/`invoices` | Belong to `company` |
| `notes`, `meetings` | Belong to `company`; feed the Knowledge AI / RAG index |
| `decisions` | New — explicit decision records feeding Module 9.9 (Knowledge Graph) and 9.2 (RAG) |
| `knowledge_edges` | New — relationship graph entries linking the above entities (Module 9.9) |
| `audit_logs` | New — every sensitive/role-changing action (Phase 10) |
| `sessions` | New — active session/device tracking (FR-10.6/10.7) |
| `api_keys` | New — tenant-issued API credentials (FR-10.8) |
| `briefings` | New — generated daily/weekly summaries (Module 9.3) |
| `focus_sessions` | New — Focus Mode records (Phase 11) |

**Tenant isolation rule (unchanged from v1, still the most important constraint in the system):** every query against a company-scoped collection filters by `companyId` derived from the JWT — never from client input.

**Role isolation rule (new in v2):** role-management endpoints must verify `actingUser.role === 'CEO' && actingUser.companyId === targetRecord.companyId`. Super Admin credentials must not pass this check — enforce this with a dedicated middleware distinct from the general auth middleware, not a shared "isAdminOrCEO" check that could accidentally admit Super Admin.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | JWT expiry + refresh; bcrypt cost ≥ 10; strict tenant + role isolation (see above); audit logging on all role/sensitive-data actions |
| Reliability | Automatic backups (FR-10.11); AI features must degrade gracefully (e.g., "not enough data yet") rather than fail silently or hallucinate |
| Performance | Dashboard and Business Health Score queries indexed on `companyId` + relevant date fields |
| Scalability | Schema/query design must not degrade as tenant count grows — no cross-tenant table scans |
| Trustworthiness | Every AI-generated claim (risk flag, forecast, chat answer) shall be traceable to source data — this is a sales requirement, not just a technical nicety, since the product's value proposition depends on the CEO trusting the recommendations |
| Usability | Role-appropriate UI enforced both client-side and server-side; Employees never see Manager/CEO-only screens even via direct URL |

---

## 6. External Interface Requirements

- **API namespaces:** `/api/platform/*` (Super Admin only — provisioning/billing), `/api/company/*` (CEO/Manager/Employee, tenant-scoped), `/api/ai/*` (COO layer: insights, risk, forecast, chat, search)
- **Notification channels:** Slack, Email, WhatsApp, in-app push (Module 8)
- **AI Layer:** reads from indexed/aggregated company data plus the knowledge graph — not raw live collection scans on every query, to keep chat/search responsive

---

## 7. MVP Prioritization (Startup Roadmap)

Since this is heading toward a commercial launch, not every module above belongs in v1. Suggested tiering, based on which features create the sharpest wedge against "just another project management tool":

**Tier 1 — MVP (ship first):**
- Revised role/auth system (Phase 1, CEO-controlled roles — this is foundational and non-negotiable)
- Company/Employee/Project/Task core (Phases 2–3)
- Executive Dashboard with Business Health Score (Phase 6, FR-9.4)
- AI COO Dashboard with Suggested Actions (Module 9.1)
- Revenue Leak Detection (Module 9.7) — concrete, immediately valuable, easy to demo

**Tier 2 — Early differentiation:**
- Company Knowledge AI / RAG search (Module 9.2)
- Project Risk Prediction (Module 9.5)
- Workload/Burnout Detection (Module 9.6)
- Smart Notifications (Phase 8)

**Tier 3 — Enterprise expansion (sell-in for larger accounts):**
- Full Enterprise Trust & Security suite (Phase 10)
- AI CEO Chat (Module 9.8)
- Knowledge Graph (Module 9.9)
- Decision Simulator (Module 9.10)
- Focus Mode (Phase 11)

This tiering isn't a requirement in itself — treat it as a recommendation to revisit once you're closer to your first paying customer, since real customer feedback should be what reorders it.

---

## 8. Traceability to Current Sprint

Your in-progress Sprint 1 work (Register, Login, JWT, bcrypt, Protected Route, Role Model, Role Middleware) maps to FR-1.1.1–FR-1.1.6 and FR-1.2.1–FR-1.2.6 above. The one change to carry into that sprint immediately: **your Role Middleware must check `companyId` match, not just role name** — a "Manager" check alone isn't sufficient once Company B's manager could otherwise touch Company A's data.
