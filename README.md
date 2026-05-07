<div align="center">

<br />

<img src="https://img.shields.io/badge/%F0%9F%9B%A1%EF%B8%8F%20Audit--X-v2.0-6366f1?style=for-the-badge&logoColor=white" height="36" alt="Audit-X" />

<h1>Audit-X</h1>

<p><strong>Professional Financial Audit Report Management Platform</strong></p>

<p>A full-stack platform for managing multi-year financial audits with role-based collaboration,<br/>structured review workflows, and automated report generation.</p>

<br/>

<a href="https://frontend-gamma-orcin-61.vercel.app"><img src="https://img.shields.io/badge/🌐%20Frontend-Live-10b981?style=for-the-badge" alt="Frontend Live" /></a>
&nbsp;
<a href="https://backend-weld-theta-88.vercel.app"><img src="https://img.shields.io/badge/⚙️%20Backend-Live-6366f1?style=for-the-badge" alt="Backend Live" /></a>
&nbsp;
<a href="https://drive.google.com/file/d/1MSZPuc--a0mTW8_FokgVy_pNbZM1V8qq/view?usp=sharing"><img src="https://img.shields.io/badge/🎬%20Demo-Watch%20Video-f59e0b?style=for-the-badge" alt="Demo Video" /></a>

<br/><br/>

<img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
<img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-7-2d3748?style=flat-square&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel" />

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access](#-role-based-access)
- [Review Workflow](#-review-workflow)
- [Project Structure](#-project-structure)

---

## 🔍 Overview

**Audit-X** is a structured workspace built for financial auditors and accounting teams. It enables multi-user collaboration on complex audit reports — covering **SFP**, **PNL**, **SCE**, **SCF**, **PPE**, and **Notes (N4-13)** — with a full review lifecycle, automatic year-over-year rollover of opening balances, and a complete audit trail on every action.

Built for audit firms and accounting students who need a reliable, organized environment for complex financial statement preparation across multiple financial years.

---

## 🌐 Live Demo

<div align="center">

| Resource | Link |
|:---|:---|
| 🌐 **Frontend** | [frontend-gamma-orcin-61.vercel.app](https://frontend-gamma-orcin-61.vercel.app) |
| ⚙️ **Backend API** | [backend-weld-theta-88.vercel.app](https://backend-weld-theta-88.vercel.app) |
| 🎬 **Demo Video** | [Watch on Google Drive](https://drive.google.com/file/d/1MSZPuc--a0mTW8_FokgVy_pNbZM1V8qq/view?usp=sharing) |
| 📦 **Frontend Repo** | [GitHub → version-2/Frontend](https://github.com/shihabul3000/Audit-X/tree/version-2/Frontend) |
| 📦 **Backend Repo** | [GitHub → version-2/Backend](https://github.com/shihabul3000/Audit-X/tree/version-2/Backend) |

</div>

### 🔑 Super Admin Test Credentials

```
Email:    super@auditx.com
Password: SuperAdmin@123
```

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 🎓 Students / Auditors
- Create and manage audit client companies
- Prepare multi-section financial reports
  - Statement of Financial Position (SFP)
  - Profit & Loss (PNL)
  - Statement of Changes in Equity (SCE)
  - Statement of Cash Flows (SCF)
  - Property, Plant & Equipment (PPE)
  - Notes to Financial Statements (N4-13)
- Automatic rollover of prior year opening balances
- Submit reports for admin review
- Receive real-time notifications on status changes

</td>
<td width="33%" valign="top">

### 🛡️ Admins
- Assign companies and financial years to students
- Review submitted reports
- Request changes with notes
- Finalize and lock completed years
- Reopen locked years when needed
- Manage student accounts (ban / unban)

</td>
<td width="33%" valign="top">

### 👑 Super Admins
- Full system governance
- Create Admin and Super Admin accounts
- Change user roles and statuses
- Soft-delete users with full audit trail
- Access all companies and financial years

</td>
</tr>
</table>

### 🌍 Platform-Wide
- Role-based dashboards with contextual UI per user type
- Real-time notification system (assignments, reviews, status changes)
- Complete review audit trail — actor, action, timestamp, and notes on every transition
- Soft-delete architecture — no data is permanently lost
- Email OTP verification on sign-up (6-digit, 10-minute expiry)
- Google OAuth sign-in support

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|:---|:---:|:---|
| **Next.js** | 15.3 | React framework — App Router, SSR, file-based routing |
| **React** | 19 | UI component library |
| **TypeScript** | 5 | Static typing across the entire frontend |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Radix UI** | latest | Accessible headless UI primitives (Dialog, Tabs, ScrollArea) |
| **TanStack React Query** | v5 | Server state management, caching, and mutations |
| **Zustand** | v5 | Client-side global state (active company, active year) |
| **Better Auth** | 1.4 | Session management and auth client |
| **Axios** | 1.x | HTTP client with interceptors |
| **Motion** | 12 | Animations and page transitions |
| **Zod** | v4 | Runtime schema validation |
| **Sonner** | 2.x | Toast notifications |
| **Lucide React** | latest | Icon library |
| **Vitest** | 4.x | Unit and component testing |

### Backend

| Technology | Version | Purpose |
|:---|:---:|:---|
| **Express.js** | 5.2 | HTTP server and routing |
| **TypeScript** | 5 | Static typing across the entire backend |
| **Prisma ORM** | v7 | Type-safe database access and migrations |
| **PostgreSQL** | 16 | Relational database |
| **Better Auth** | 1.4 | Authentication — email/password, Google OAuth, OTP |
| **Nodemailer** | 8.x | Transactional email (OTP verification) |
| **Zod** | v4 | Request body validation |
| **Vitest + fast-check** | latest | Unit tests and property-based testing |
| **tsx** | 4.x | TypeScript execution for development |

### Infrastructure & Deployment

| Service | Purpose |
|:---|:---|
| **Vercel** | Frontend and backend deployment (serverless) |
| **PostgreSQL** | Production relational database |
| **Google OAuth 2.0** | Social authentication provider |
| **Nodemailer / SMTP** | Transactional email delivery |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Frontend  (Next.js 15)                    │
│                                                               │
│   Landing Page  →  Auth  →  Dashboard  →  Audit Editor       │
│                                                               │
│   State:  Zustand (UI state) + React Query (server state)     │
│   Auth:   Better Auth client  +  session cookies              │
└───────────────────────────┬──────────────────────────────────┘
                            │  HTTPS / REST
                            │  /api/auth/*   →  Better Auth
                            │  /api/v1/*     →  Business Logic
┌───────────────────────────▼──────────────────────────────────┐
│                     Backend  (Express 5)                      │
│                                                               │
│   CORS → Better Auth → checkAuth middleware → Zod validation  │
│                                                               │
│   Modules:  Users · Companies · FinancialYears                │
│             AuditData · Notifications                         │
└───────────────────────────┬──────────────────────────────────┘
                            │  Prisma ORM
┌───────────────────────────▼──────────────────────────────────┐
│                     PostgreSQL Database                       │
│                                                               │
│   User · Session · Account · Company · CompanyAssignment      │
│   FinancialYear · FinancialYearAssignment                     │
│   AuditData · NotesData · Notification · ReviewEvent          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials *(optional — for social login)*

### 1. Clone the repository

```bash
git clone https://github.com/shihabul3000/Audit-X.git
cd Audit-X
git checkout version-2
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file (see [Environment Variables](#-environment-variables)), then run:

```bash
# Push schema to database
npm run push

# Generate Prisma client
npm run generate

# Start development server
npm run dev
```

> Backend runs on **http://localhost:5000**

### 3. Frontend setup

```bash
cd ../Frontend
npm install
```

Create a `.env.local` file, then run:

```bash
npm run dev
```

> Frontend runs on **http://localhost:3000**

---

## 🔐 Environment Variables

### Backend — `Backend/.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/auditx

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:5000

# App URLs
FRONTEND_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email / SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Audit-X <your-email@gmail.com>
```

### Frontend — `Frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📡 API Reference

### Authentication  `/api/auth/*`

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/auth/sign-up/email` | Register with email and password |
| `POST` | `/api/auth/sign-in/email` | Sign in with email and password |
| `POST` | `/api/auth/sign-out` | Sign out current session |
| `GET` | `/api/auth/get-session` | Get current session info |

### Users  `/api/v1/users`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/me` | All | Current user profile |
| `GET` | `/` | Admin+ | List all users |
| `PATCH` | `/:id` | Super Admin | Update role or status |
| `DELETE` | `/:id` | Super Admin | Soft delete user |
| `POST` | `/create-admin` | Super Admin | Create admin account |

### Companies  `/api/v1/companies`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/` | All | List companies (role-filtered) |
| `POST` | `/` | All | Create company |
| `PATCH` | `/:id` | Owner / Admin | Update company name |
| `DELETE` | `/:id` | Admin+ | Soft delete company |
| `POST` | `/:id/assign` | Admin+ | Assign user to company |
| `POST` | `/:id/unassign` | Admin+ | Unassign user from company |

### Financial Years  `/api/v1/companies/:companyId/financial-years`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/` | All | List financial years for company |
| `POST` | `/` | All | Create new year (auto rollover) |
| `DELETE` | `/:id` | Owner / Admin | Soft delete year |
| `GET` | `/:id/data` | All | Get audit + notes data |
| `PUT` | `/:id/audit-data` | All | Save audit report data |
| `PUT` | `/:id/notes-data` | All | Save notes data |
| `POST` | `/:id/submit` | Student | Submit for review |
| `POST` | `/:id/review-actions` | Admin+ | Perform review action |

### Notifications  `/api/v1/notifications`

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/` | Get all notifications for current user |
| `PATCH` | `/:id/read` | Mark notification as read |

---

## 👥 Role-Based Access

```
👑  SUPER_ADMIN
    ├── Create Admin and Super Admin accounts
    ├── Update any user's role or status
    ├── Ban, unban, and soft-delete any user
    ├── Access all companies and financial years
    └── Everything an ADMIN can do

🛡️  ADMIN
    ├── Assign / unassign companies to students
    ├── Review submitted financial years
    ├── Request changes with notes
    ├── Finalize and lock completed years
    ├── Reopen locked years
    ├── Ban / unban student accounts
    └── Everything a STUDENT can do

🎓  STUDENT
    ├── Create and manage companies
    ├── Create financial years (with automatic rollover)
    ├── Edit audit reports (SFP, PNL, SCE, SCF, PPE, N4-13)
    └── Submit financial years for admin review
```

---

## 🔄 Review Workflow

Financial years follow a structured, state-machine review lifecycle:

```
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   DRAFT  ──[Student submits]──►  SUBMITTED              │
  │     ▲                               │                   │
  │     │                    [Admin starts review]          │
  │     │                               ▼                   │
  │     │                          UNDER_REVIEW             │
  │     │                         /           \             │
  │     │          [Request changes]       [Finalize]       │
  │     │                /                      \           │
  │     │    CHANGES_REQUESTED              FINALIZED 🔒    │
  │     │          │                            │           │
  │     │   [Student resubmits]           [Admin reopens]   │
  │     │          │                            │           │
  │     │          ▼                            │           │
  │     └──── SUBMITTED ◄──────────────────────┘           │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

Every state transition is recorded as a **`ReviewEvent`** — capturing the actor, action type, optional note, and timestamp — providing a complete, immutable audit trail.

---

## 📁 Project Structure

```
Audit-X/
│
├── Backend/
│   ├── prisma/
│   │   └── schema/
│   │       ├── auth.prisma            # User, Session, Account, Verification
│   │       ├── company.prisma         # Company, CompanyAssignment
│   │       ├── financialYear.prisma   # FinancialYear, FinancialYearAssignment
│   │       ├── auditData.prisma       # AuditData, NotesData
│   │       ├── notification.prisma    # Notification
│   │       ├── reviewEvent.prisma     # ReviewEvent (audit trail)
│   │       └── enums.prisma           # Role, UserStatus, ReviewStatus, NotificationType
│   │
│   └── src/
│       ├── app/
│       │   ├── config/                # Environment variable validation
│       │   ├── lib/                   # Better Auth setup, Prisma client
│       │   ├── middleware/            # checkAuth, Zod validation, error handler
│       │   ├── module/
│       │   │   ├── auditData/         # Audit data CRUD (upsert pattern)
│       │   │   ├── company/           # Company management + assignments
│       │   │   ├── financialYear/     # Year lifecycle + rollover engine
│       │   │   ├── notification/      # Notification service
│       │   │   └── user/              # User management + admin creation
│       │   ├── routes/                # Route aggregation
│       │   └── utils/                 # Email helpers
│       ├── app.ts                     # Express app setup + CORS
│       └── server.ts                  # Server entry point
│
└── Frontend/
    └── src/
        ├── app/
        │   ├── dashboard/             # Role-based dashboard pages
        │   │   ├── system/            # Super admin governance
        │   │   ├── admin/             # Admin firm management
        │   │   └── my-companies/      # Student company dashboard
        │   ├── fs/[tab]/              # Audit report editor (dynamic tab routing)
        │   ├── auth/                  # Authentication page
        │   └── globals.css            # Global styles + Tailwind v4 theme
        │
        ├── components/
        │   ├── auth/                  # AuthPageClient
        │   ├── dashboard/             # SuperAdmin, Admin, Company dashboard clients
        │   ├── fs/                    # FSTabClient, NavigationNew
        │   ├── landing/               # Navbar, Hero, Features, CTA, Footer
        │   └── tabs/                  # SFP, PNL, SCE, SCF, PPE, N4-13, Cover
        │
        ├── hooks/                     # useAuditDataAPI, useGlobalStoreSync
        ├── lib/                       # authClient (Better Auth), Axios httpClient
        ├── providers/                 # React Query, Sonner toast providers
        ├── services/api/              # authService, companyService, financialYearService, etc.
        ├── store/                     # Zustand stores — useAppStore, useUIStore
        └── types.ts                   # Shared TypeScript types (Tab, AuditReportData, PPEData)
```

---

<div align="center">

<br/>

**Built with ❤️ using TypeScript · Next.js · Express · Prisma · PostgreSQL**

<br/>

<img src="https://img.shields.io/badge/TypeScript-Full%20Stack-3178c6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" />

</div>
