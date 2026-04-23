# Requirements Document

## Introduction

Audit-X হলো একটি অডিট রিপোর্ট ম্যানেজমেন্ট প্ল্যাটফর্ম। বর্তমানে এটি React + Vite + Zustand দিয়ে local state-এ কাজ করছে। এই প্রজেক্টের লক্ষ্য হলো এটিকে production-ready করা — Next.js frontend, Express + Prisma + PostgreSQL backend, Better Auth authentication, এবং সম্পূর্ণ RBAC (Role-Based Access Control) সহ।

Prototype-এর সব ফাংশনালিটি হুবহু কাজ করবে, শুধু data এখন database-এ persist হবে এবং multi-user collaboration সম্ভব হবে।

## Glossary

- **System**: Audit-X platform (frontend + backend combined)
- **Backend**: Express.js + Prisma + PostgreSQL server
- **Frontend**: Next.js application
- **User**: Any authenticated person using the system
- **Student**: A user with `student` role who creates and edits financial reports
- **Admin**: A user with `admin` role who reviews student submissions
- **SuperAdmin**: A user with `super_admin` role who manages the entire platform
- **Company**: An audit client entity created by a user
- **FinancialYear**: A specific year's audit data belonging to a Company
- **AuditData**: The financial statement data (SFP, PNL, SCE, SCF, PPE, Notes, Discussion)
- **Better_Auth**: Authentication library used for session management
- **Prisma**: ORM used for database operations
- **OTP**: One-time password for email verification

---

## Requirements

### Requirement 1: Backend Project Setup

**User Story:** As a developer, I want a properly structured Express backend, so that the frontend can communicate with a real database.

#### Acceptance Criteria

1. THE Backend SHALL be initialized as a TypeScript Express.js project following Demo-File Backend structure
2. THE Backend SHALL use Prisma ORM with PostgreSQL (Neon cloud) as the database
3. THE Backend SHALL use Better Auth for authentication and session management
4. THE Backend SHALL expose APIs on port 5000
5. THE Backend SHALL implement CORS to allow requests from the Next.js frontend on port 3000
6. WHEN the server starts, THE Backend SHALL seed a SuperAdmin account if none exists
7. THE Backend SHALL use `tsx watch` for development hot-reload

---

### Requirement 2: Database Schema Design

**User Story:** As a developer, I want a complete database schema, so that all application data is properly persisted.

#### Acceptance Criteria

1. THE Database SHALL have a `User` model with fields: id, name, email, emailVerified, role (STUDENT/ADMIN/SUPER_ADMIN), status (ACTIVE/BLOCKED/DELETED), needPasswordChange, isDeleted, deletedAt, image, createdAt, updatedAt
2. THE Database SHALL have Better Auth models: Session, Account, Verification
3. THE Database SHALL have a `Company` model with fields: id, name, createdByUserId, createdAt, updatedAt
4. THE Database SHALL have a `CompanyAssignment` model linking users to companies
5. THE Database SHALL have a `FinancialYear` model with fields: id, companyId, year, reportingDate, startDate, status, reviewStatus (DRAFT/SUBMITTED/UNDER_REVIEW/CHANGES_REQUESTED/FINALIZED), isLocked, createdByUserId, currentReviewerUserId, finalizedByUserId, finalizedAt, submittedAt, lastEditedByUserId, createdAt, updatedAt
6. THE Database SHALL have a `FinancialYearAssignment` model linking users to financial years
7. THE Database SHALL have a `ReviewEvent` model tracking the review history of financial years
8. THE Database SHALL have an `AuditData` model storing the JSON audit report data per financial year
9. THE Database SHALL have a `NotesData` model storing the JSON notes (N4-13) data per financial year
10. THE Database SHALL have a `Notification` model for in-app notifications

---

### Requirement 3: Authentication System

**User Story:** As a user, I want to securely register and login, so that my data is protected.

#### Acceptance Criteria

1. WHEN a new user registers with name, email, and password, THE System SHALL create an account with `student` role by default
2. WHEN a user registers, THE System SHALL send an OTP email for verification
3. WHEN a user submits the correct OTP, THE System SHALL verify the email and allow login
4. WHEN a user logs in with correct credentials, THE System SHALL create a session and return a session token
5. WHEN a user logs in with Google OAuth, THE System SHALL create or link their account
6. WHEN an unverified user tries to login, THE System SHALL reject the login and prompt for OTP verification
7. WHEN a user logs out, THE System SHALL invalidate the session
8. IF a user's status is BLOCKED, THEN THE System SHALL allow login but restrict all functional actions
9. THE System SHALL use Better Auth with emailOTP plugin for verification

---

### Requirement 4: User Management (RBAC)

**User Story:** As a SuperAdmin, I want to manage all users, so that I can control platform access.

#### Acceptance Criteria

1. WHEN a SuperAdmin creates an Admin, THE System SHALL create the user with `admin` role
2. WHEN a SuperAdmin creates another SuperAdmin, THE System SHALL create the user with `super_admin` role
3. WHEN a SuperAdmin or Admin blocks a user, THE System SHALL set the user's status to BLOCKED
4. WHEN a SuperAdmin or Admin unblocks a user, THE System SHALL set the user's status to ACTIVE
5. WHEN a SuperAdmin soft-deletes a user, THE System SHALL set isDeleted to true
6. THE System SHALL expose GET /api/v1/users endpoint for SuperAdmin to list all users
7. THE System SHALL expose PATCH /api/v1/users/:id endpoint for role/status updates
8. WHILE a user is BLOCKED, THE System SHALL prevent company creation, financial year editing, and data submission

---

### Requirement 5: Company Management

**User Story:** As a user, I want to create and manage companies, so that I can organize audit work by client.

#### Acceptance Criteria

1. WHEN an authenticated user creates a company with a name, THE System SHALL persist it to the database and assign the creator
2. WHEN a user requests their companies, THE System SHALL return only companies they are assigned to or created
3. WHEN a SuperAdmin or Admin requests companies, THE System SHALL return all companies
4. WHEN a user updates a company name, THE System SHALL persist the change
5. WHEN a SuperAdmin or Admin assigns a company to a user, THE System SHALL create a CompanyAssignment record
6. WHEN a SuperAdmin deletes a company, THE System SHALL soft-delete it and all associated financial years
7. THE System SHALL expose CRUD endpoints under /api/v1/companies

---

### Requirement 6: Financial Year Management

**User Story:** As a user, I want to create and manage financial years per company, so that I can track audit data year by year.

#### Acceptance Criteria

1. WHEN a user creates a new financial year for a company, THE System SHALL persist it with status DRAFT
2. WHEN a new financial year is created and a previous year exists, THE System SHALL carry forward closing balances as opening balances (rollover logic)
3. WHEN a user sets a financial year as active, THE System SHALL track the activeYearId in the session/frontend state
4. WHEN a user deletes a financial year, THE System SHALL soft-delete it
5. THE System SHALL expose CRUD endpoints under /api/v1/companies/:companyId/financial-years
6. WHEN a financial year is FINALIZED, THE System SHALL set isLocked to true and prevent further edits

---

### Requirement 7: Audit Data Persistence

**User Story:** As a user, I want my audit report data saved to the database, so that it persists across sessions and devices.

#### Acceptance Criteria

1. WHEN a user updates audit data (SFP, PNL, SCE, SCF, PPE, Cover), THE System SHALL save the AuditData JSON to the database
2. WHEN a user updates notes data (N4-13), THE System SHALL save the NotesData JSON to the database
3. WHEN a user opens a financial year, THE System SHALL load the AuditData and NotesData from the database
4. THE System SHALL expose PUT /api/v1/financial-years/:yearId/audit-data endpoint
5. THE System SHALL expose PUT /api/v1/financial-years/:yearId/notes-data endpoint
6. THE System SHALL expose GET /api/v1/financial-years/:yearId/data endpoint
7. WHEN saving data, THE System SHALL record lastEditedByUserId on the financial year

---

### Requirement 8: Review Workflow

**User Story:** As a student, I want to submit my work for review, so that an admin can approve it.

#### Acceptance Criteria

1. WHEN a student submits a financial year, THE System SHALL change reviewStatus to SUBMITTED
2. WHEN an Admin or SuperAdmin starts reviewing, THE System SHALL change reviewStatus to UNDER_REVIEW
3. WHEN a reviewer requests changes, THE System SHALL change reviewStatus to CHANGES_REQUESTED and allow student to edit again
4. WHEN a reviewer finalizes, THE System SHALL change reviewStatus to FINALIZED and set isLocked to true
5. WHEN a reviewer reopens a finalized year, THE System SHALL change reviewStatus to DRAFT and set isLocked to false
6. WHEN any review action occurs, THE System SHALL create a ReviewEvent record
7. THE System SHALL expose POST /api/v1/financial-years/:yearId/submit endpoint
8. THE System SHALL expose POST /api/v1/financial-years/:yearId/review-actions endpoint

---

### Requirement 9: Notifications

**User Story:** As a user, I want in-app notifications, so that I know when actions are taken on my work.

#### Acceptance Criteria

1. WHEN a financial year is submitted, THE System SHALL create notifications for assigned admins and super admins
2. WHEN changes are requested, THE System SHALL create a notification for the financial year creator
3. WHEN a year is finalized, THE System SHALL create a notification for the financial year creator
4. WHEN a user is blocked or unblocked, THE System SHALL create a notification for that user
5. WHEN a user reads a notification, THE System SHALL mark it as read
6. THE System SHALL expose GET /api/v1/notifications endpoint for the current user
7. THE System SHALL expose PATCH /api/v1/notifications/:id/read endpoint

---

### Requirement 10: Next.js Frontend

**User Story:** As a user, I want a fast, production-ready frontend, so that I have a smooth experience.

#### Acceptance Criteria

1. THE Frontend SHALL be a Next.js 15 application using App Router
2. THE Frontend SHALL use TanStack Query for server state management
3. THE Frontend SHALL use Axios for API calls with interceptors for auth
4. THE Frontend SHALL use Zustand only for UI state (active company, active year, tab navigation)
5. THE Frontend SHALL preserve all existing financial statement UI components (SFP, PNL, SCE, SCF, PPE, N4-13, P_Discussion, Cover)
6. THE Frontend SHALL implement the same routing structure: /, /auth, /dashboard/*, /fs/*
7. WHEN a user is not authenticated, THE Frontend SHALL redirect to /auth
8. WHEN a user's session expires, THE Frontend SHALL redirect to /auth
9. THE Frontend SHALL implement role-based dashboard views (student, admin, super_admin)
10. THE Frontend SHALL use the same dark theme and UI components as the Prototype

---

### Requirement 11: Data Migration Strategy

**User Story:** As a developer, I want a clean migration from local state to database, so that the transition is smooth.

#### Acceptance Criteria

1. THE Frontend SHALL replace Zustand persist store with API calls for all data operations
2. THE Frontend SHALL keep Zustand only for ephemeral UI state (activeCompanyId, activeYearId, currentUserId)
3. WHEN the app loads, THE Frontend SHALL fetch user data, companies, and active year data from the API
4. THE Frontend SHALL implement optimistic updates where appropriate for smooth UX
5. THE System SHALL maintain the same data structures as the Prototype (AuditReportData, N4_13_State types)
