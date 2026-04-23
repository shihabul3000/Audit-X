# Design Document: Audit-X Production

## Overview

Audit-X কে production-ready করার জন্য দুটি নতুন প্রজেক্ট তৈরি হবে:

1. **`Assignment-Backend/`** — Express.js + TypeScript + Prisma + PostgreSQL + Better Auth
2. **`Assignment/`** — Next.js 15 (current React+Vite কে replace করবে, সব UI component রাখা হবে)

Prototype এর সম্পূর্ণ ফাংশনালিটি হুবহু কাজ করবে। শুধু data এখন Neon PostgreSQL database-এ persist হবে।

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                                                          │
│  Next.js 15 (App Router) - Port 3000                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Auth Pages  │  │  Dashboard   │  │  /fs/* Pages  │ │
│  │  /auth       │  │  /dashboard  │  │  (Audit UI)   │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
│                                                          │
│  State: TanStack Query (server) + Zustand (UI only)     │
└─────────────────────────────────────────────────────────┘
                          │ HTTP/HTTPS
                          │ Axios + Better Auth client
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Express.js Backend - Port 5000              │
│                                                          │
│  Better Auth (/api/auth/*)                              │
│  REST API (/api/v1/*)                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Users   │ │Companies │ │Fin.Years │ │  Notifs  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Middleware: checkAuth, validateRequest, errorHandler   │
└─────────────────────────────────────────────────────────┘
                          │ Prisma ORM
                          ▼
┌─────────────────────────────────────────────────────────┐
│           Neon PostgreSQL (Cloud Database)               │
│                                                          │
│  user, session, account, verification                   │
│  company, company_assignment                            │
│  financial_year, financial_year_assignment              │
│  review_event, audit_data, notes_data                   │
│  notification                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Backend Structure

```
Assignment-Backend/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma       (generator + datasource)
│   │   ├── enums.prisma        (Role, UserStatus, ReviewStatus)
│   │   ├── auth.prisma         (User, Session, Account, Verification)
│   │   ├── company.prisma      (Company, CompanyAssignment)
│   │   ├── financialYear.prisma (FinancialYear, FinancialYearAssignment)
│   │   ├── reviewEvent.prisma  (ReviewEvent)
│   │   ├── auditData.prisma    (AuditData, NotesData)
│   │   └── notification.prisma (Notification)
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── lib/
│   │   │   ├── auth.ts         (Better Auth config)
│   │   │   └── prisma.ts       (Prisma client)
│   │   ├── middleware/
│   │   │   ├── checkAuth.ts
│   │   │   ├── validateRequest.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   └── notFound.ts
│   │   ├── shared/
│   │   │   ├── catchAsync.ts
│   │   │   └── sendResponse.ts
│   │   ├── errorHelpers/
│   │   │   └── AppError.ts
│   │   ├── utils/
│   │   │   ├── email.ts
│   │   │   └── seed.ts
│   │   └── module/
│   │       ├── user/
│   │       ├── company/
│   │       ├── financialYear/
│   │       ├── auditData/
│   │       └── notification/
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env
```

### Frontend Structure (Next.js)

```
Assignment/                     (converted to Next.js)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            (Landing page)
│   │   ├── auth/
│   │   │   └── page.tsx        (Auth page)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── my-companies/
│   │   │   ├── admin/
│   │   │   └── system/
│   │   └── fs/
│   │       └── [tab]/
│   │           └── page.tsx
│   ├── components/             (all existing UI components preserved)
│   │   ├── tabs/               (Cover, SFP, PNL, SCE, SCF, N4_13, PPE, P_Discussion)
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── auth/
│   │   └── ui/
│   ├── hooks/
│   │   ├── useAuditData.ts     (API-connected version)
│   │   └── useGlobalStoreSync.ts
│   ├── lib/
│   │   ├── axios/
│   │   │   └── httpClient.ts
│   │   └── authClient.ts       (Better Auth client)
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── company.service.ts
│   │   ├── financialYear.service.ts
│   │   └── auditData.service.ts
│   ├── store/
│   │   └── useAppStore.ts      (UI state only: activeCompanyId, activeYearId)
│   ├── providers/
│   │   └── QueryProvider.tsx
│   └── types/
│       └── index.ts
├── package.json
└── next.config.ts
```

---

## Data Models

### Prisma Enums

```prisma
enum Role {
  STUDENT
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  BLOCKED
  DELETED
}

enum ReviewStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  CHANGES_REQUESTED
  FINALIZED
}
```

### Key Models

```prisma
model Company {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name            String
  createdByUserId String
  isDeleted       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  financialYears  FinancialYear[]
  assignments     CompanyAssignment[]
  @@map("company")
}

model FinancialYear {
  id                    String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId             String       @db.Uuid
  year                  Int
  reportingDate         String
  startDate             String
  reviewStatus          ReviewStatus @default(DRAFT)
  isLocked              Boolean      @default(false)
  createdByUserId       String
  currentReviewerUserId String?
  finalizedByUserId     String?
  finalizedAt           DateTime?
  submittedAt           DateTime?
  lastEditedByUserId    String?
  isDeleted             Boolean      @default(false)
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
  company               Company      @relation(...)
  auditData             AuditData?
  notesData             NotesData?
  reviewEvents          ReviewEvent[]
  assignments           FinancialYearAssignment[]
  @@map("financial_year")
}

model AuditData {
  id              String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  financialYearId String        @unique @db.Uuid
  data            Json          // AuditReportData JSON
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  financialYear   FinancialYear @relation(...)
  @@map("audit_data")
}

model NotesData {
  id              String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  financialYearId String        @unique @db.Uuid
  data            Json          // N4_13_State JSON
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  financialYear   FinancialYear @relation(...)
  @@map("notes_data")
}
```

---

## API Endpoints

### Auth (Better Auth handles these)
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`
- `POST /api/auth/email-otp/send-verification-otp`
- `POST /api/auth/email-otp/verify-email`
- `GET /api/auth/callback/google`

### Users
- `GET /api/v1/users` — SuperAdmin: all users
- `GET /api/v1/users/me` — current user profile
- `PATCH /api/v1/users/:id` — update role/status
- `DELETE /api/v1/users/:id` — soft delete (SuperAdmin only)

### Companies
- `GET /api/v1/companies` — user's companies
- `POST /api/v1/companies` — create company
- `PATCH /api/v1/companies/:id` — update company
- `DELETE /api/v1/companies/:id` — soft delete

### Financial Years
- `GET /api/v1/companies/:companyId/financial-years` — list years
- `POST /api/v1/companies/:companyId/financial-years` — create year
- `DELETE /api/v1/financial-years/:yearId` — soft delete
- `GET /api/v1/financial-years/:yearId/data` — get audit + notes data
- `PUT /api/v1/financial-years/:yearId/audit-data` — save audit data
- `PUT /api/v1/financial-years/:yearId/notes-data` — save notes data
- `POST /api/v1/financial-years/:yearId/submit` — submit for review
- `POST /api/v1/financial-years/:yearId/review-actions` — review actions

### Notifications
- `GET /api/v1/notifications` — user's notifications
- `PATCH /api/v1/notifications/:id/read` — mark as read

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: New user always gets student role

*For any* valid registration request, the created user's role should always be STUDENT regardless of any other input fields.

**Validates: Requirements 3.1**

---

### Property 2: Data persistence round-trip

*For any* valid AuditReportData or NotesData object, saving it to the database and then retrieving it should produce an equivalent object (JSON deep equality).

**Validates: Requirements 7.1, 7.2**

---

### Property 3: Company visibility scoping

*For any* student user, the list of companies returned by GET /api/v1/companies should be a subset of companies where the user has a CompanyAssignment record or is the creator.

**Validates: Requirements 5.2**

---

### Property 4: Financial year rollover invariant

*For any* financial year Y2 created after Y1 for the same company, Y2's opening balances (costOpening, depOpening per asset) should equal Y1's closing balances (costOpening + costAddition - costDisposal, depOpening + depCharged + depAdjustment).

**Validates: Requirements 6.2**

---

### Property 5: Review state machine validity

*For any* financial year, the reviewStatus transitions must follow the valid state machine: DRAFT → SUBMITTED → UNDER_REVIEW → (CHANGES_REQUESTED → DRAFT) | FINALIZED. Invalid transitions should be rejected with an error.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

---

### Property 6: Blocked user action restriction

*For any* user with status BLOCKED, all mutating API endpoints (POST, PUT, PATCH, DELETE) should return 403 Forbidden, while GET /api/auth/get-session should still succeed.

**Validates: Requirements 3.8, 4.8**

---

### Property 7: Notification creation on review actions

*For any* review action (submit, request-changes, finalize), the appropriate notification records should be created for the relevant users (assignees, creator, reviewers).

**Validates: Requirements 9.1, 9.2, 9.3**

---

## Error Handling

- All errors go through `globalErrorHandler` middleware
- `AppError` class for operational errors with HTTP status codes
- Zod validation errors return 400 with field-level messages
- Auth errors return 401
- Permission errors return 403
- Not found errors return 404
- Unexpected errors return 500

---

## Testing Strategy

### Unit Tests
- Test individual service functions with mock Prisma client
- Test validation schemas with valid and invalid inputs
- Test rollover calculation logic (pure function)
- Test review state machine transitions

### Property-Based Tests (using fast-check)
- Property 1: Registration always produces student role
- Property 2: Data round-trip (serialize → save → load → deserialize)
- Property 3: Company scoping for student users
- Property 4: Rollover balance calculation invariant
- Property 5: Review state machine — valid and invalid transitions
- Property 6: Blocked user restriction
- Property 7: Notification creation

Each property test runs minimum 100 iterations.
Tag format: `Feature: audit-x-production, Property N: <property_text>`

### Integration Tests
- Full auth flow: register → verify OTP → login → get session
- Company CRUD flow
- Financial year creation with rollover
- Audit data save and load
- Review workflow end-to-end
