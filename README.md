# Multi-Company Management & AI-Driven Business Intelligence SaaS Platform

Full-stack enterprise B2B SaaS platform built with **Node.js, Express, TypeScript, Mongoose (MongoDB), React, Vite, TailwindCSS, Recharts, and Lucide React**.

---

## Complete Feature Matrix

### 🏢 Multi-Tenant Security & Role-Based Access Control (RBAC)
- **Tenant Isolation**: Every query filters data strictly by `companyId` extracted from verified JWT claims.
- **Roles**: Super Admin, CEO, Manager, Employee.

### 💳 SaaS Subscription Billing & Quota Engine (Phase 9)
- **Tiered Plans**: *Starter* ($49/mo), *Business* ($199/mo), *Enterprise* ($499/mo).
- **Plan Quotas**: Quota middleware enforcing employee seat limits, project limits, and AI query quotas per tenant.
- **Self-Service Billing Portal**: Live resource quota meters and 1-click plan upgrade/downgrade workflows.

### ⏱️ Time Tracking & Employee Expense Operations (Phase 10)
- **Live Task Stopwatch Widget**: Interactive timer for logging active work hours.
- **Timesheets & Billable Labor Calculator**: Employee hourly rate calculations vs project budget.
- **Expense Approval Engine**: Category tracking (Software, Travel, Office, Marketing) with Manager/CEO approval & rejection workflows.

### 🛡️ SOC2 Security Audit Trail & White-Labeling (Phase 12)
- **Security Audit Trail**: Immutable logging of user activity (`who`, `role`, `action`, `target entity`, `IP address`, `timestamp`).
- **Tenant White-Labeling**: Custom logo URL, primary accent color selector, and custom subdomain binding.

### 🤖 AI COO Intelligence Layer (Phase 8 & 13)
- **Executive Assistant**: Natural language query processing ("What should I focus on today?").
- **Project Risk Detector**: Scores project risk levels (`High`, `Medium`, `Low`) based on deadline proximity and overdue task ratios.
- **Revenue Forecast Engine**: Time-series cash flow trend model with confidence scoring.

---

## Navigation & Module Routes

- `/dashboard`: Executive Dashboard (Cards & Visual Charts)
- `/ai-coo`: AI COO Intelligence Layer (Assistant, Risk Flags, Revenue Forecast)
- `/companies`: Company Directory & Tenant Profiles
- `/employees`: Employee Roster & Profiles
- `/projects`: Project Deliverables & Team Allocations
- `/tasks`: Interactive Task Kanban Board
- `/operations`: Live Time Tracking Stopwatch & Expense Approvals
- `/knowledge`: Company Notes & Meeting Minutes Checklists
- `/revenue`: Client Directory & Invoice Ledger
- `/analytics`: Business Intelligence Metrics
- `/billing`: SaaS Subscription Plans & Quota Meters
- `/security-audit`: SOC2 Audit Trail & Tenant White-Labeling

---

## Quick Start Guide

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed
npm run dev
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
Open browser at `http://localhost:3000`.

### 3. Demo Credentials (From `npm run seed`)

> **Default Password for ALL Accounts:** `Password123!`

| Role | Email | Scope |
|---|---|---|
| **Super Admin** | `admin@platform.com` | Global Platform |
| **Apex CEO** | `ceo@apex.com` | Apex Tech Solutions |
| **Apex Manager** | `manager@apex.com` | Apex Tech Solutions |
| **Apex Employee** | `dev@apex.com` | Apex Tech Solutions |
