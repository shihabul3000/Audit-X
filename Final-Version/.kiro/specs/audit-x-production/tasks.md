# Implementation Plan: Audit-X Production

## Overview

Prototype (React+Vite+Zustand local state) কে production-ready করা হবে। Backend নতুন তৈরি হবে `Assignment-Backend/` ফোল্ডারে। Frontend `Assignment/` ফোল্ডারকে Next.js-এ convert করা হবে। সব existing UI component হুবহু রাখা হবে।

## Tasks

- [x] 1. Backend Project Initialization
  - `Assignment-Backend/` ফোল্ডারে নতুন TypeScript Express project তৈরি করো
  - `package.json`, `tsconfig.json`, `.env` setup করো
  - Demo-File Backend এর exact same dependencies ব্যবহার করো
  - `src/app.ts` এবং `src/server.ts` তৈরি করো
  - _Requirements: 1.1, 1.4, 1.5, 1.7_

- [x] 2. Prisma Schema Setup
  - [x] 2.1 Prisma initialize করো এবং schema files তৈরি করো
    - `prisma/schema/schema.prisma` (generator + datasource with Neon DATABASE_URL)
    - `prisma/schema/enums.prisma` (Role: STUDENT/ADMIN/SUPER_ADMIN, UserStatus, ReviewStatus)
    - `prisma/schema/auth.prisma` (User, Session, Account, Verification — Better Auth compatible)
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Business models schema তৈরি করো
    - `prisma/schema/company.prisma` (Company, CompanyAssignment)
    - `prisma/schema/financialYear.prisma` (FinancialYear, FinancialYearAssignment)
    - `prisma/schema/reviewEvent.prisma` (ReviewEvent)
    - `prisma/schema/auditData.prisma` (AuditData, NotesData — Json fields)
    - `prisma/schema/notification.prisma` (Notification)
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [x] 2.3 Prisma migration run করো
    - `prisma migrate dev --name init` চালাও
    - Generated Prisma client verify করো
    - _Requirements: 2.1_

- [x] 3. Backend Core Infrastructure
  - [x] 3.1 Config এবং shared utilities তৈরি করো
    - `src/app/config/env.ts` — সব env variables validate করো
    - `src/app/lib/prisma.ts` — Prisma client singleton
    - `src/app/shared/catchAsync.ts` — async error wrapper
    - `src/app/shared/sendResponse.ts` — standardized response helper
    - `src/app/errorHelpers/AppError.ts` — custom error class
    - _Requirements: 1.1_

  - [x] 3.2 Better Auth setup করো
    - `src/app/lib/auth.ts` — Better Auth config with emailAndPassword, emailOTP, Google OAuth, bearer plugin
    - Email OTP sender function (nodemailer with Gmail SMTP from .env)
    - SuperAdmin skip OTP logic
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.9_

  - [x] 3.3 Middleware তৈরি করো
    - `src/app/middleware/checkAuth.ts` — session verify + role check
    - `src/app/middleware/validateRequest.ts` — Zod schema validation
    - `src/app/middleware/globalErrorHandler.ts` — centralized error handling
    - `src/app/middleware/notFound.ts` — 404 handler
    - _Requirements: 3.4, 3.8, 4.8_

  - [x] 3.4 SuperAdmin seed utility তৈরি করো
    - `src/app/utils/seed.ts` — seed super admin on startup
    - `src/app/utils/email.ts` — nodemailer email sender
    - _Requirements: 1.6_

- [x] 4. User Module
  - [x] 4.1 User CRUD API তৈরি করো
    - `src/app/module/user/user.service.ts` — getAllUsers, getUserById, updateUser, softDeleteUser, createAdmin, createSuperAdmin
    - `src/app/module/user/user.controller.ts`
    - `src/app/module/user/user.route.ts`
    - `src/app/module/user/user.validation.ts` — Zod schemas
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 4.2 Write property test for user registration role
    - **Property 1: New user always gets student role**
    - **Validates: Requirements 3.1**

- [x] 5. Company Module
  - [x] 5.1 Company CRUD API তৈরি করো
    - `src/app/module/company/company.service.ts` — createCompany, getCompanies, updateCompany, deleteCompany, assignCompany
    - `src/app/module/company/company.controller.ts`
    - `src/app/module/company/company.route.ts`
    - `src/app/module/company/company.validation.ts`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 5.2 Write property test for company visibility scoping
    - **Property 3: Company visibility scoping**
    - **Validates: Requirements 5.2**

- [x] 6. Financial Year Module
  - [x] 6.1 Financial Year CRUD API তৈরি করো
    - `src/app/module/financialYear/financialYear.service.ts` — createFinancialYear (with rollover logic), getFinancialYears, deleteFinancialYear
    - `src/app/module/financialYear/financialYear.controller.ts`
    - `src/app/module/financialYear/financialYear.route.ts`
    - `src/app/module/financialYear/financialYear.validation.ts`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 6.2 Write property test for financial year rollover invariant
    - **Property 4: Financial year rollover invariant**
    - **Validates: Requirements 6.2**

- [x] 7. Audit Data Module
  - [x] 7.1 Audit Data save/load API তৈরি করো
    - `src/app/module/auditData/auditData.service.ts` — getYearData, saveAuditData, saveNotesData
    - `src/app/module/auditData/auditData.controller.ts`
    - `src/app/module/auditData/auditData.route.ts`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 7.2 Write property test for data persistence round-trip
    - **Property 2: Data persistence round-trip**
    - **Validates: Requirements 7.1, 7.2**

- [x] 8. Review Workflow Module
  - [x] 8.1 Review actions API তৈরি করো
    - `src/app/module/financialYear/review.service.ts` — submitYear, startReview, requestChanges, finalizeYear, reopenYear
    - Review action endpoints: POST /api/v1/financial-years/:yearId/submit, /review-actions
    - State machine validation (invalid transitions rejected)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [x] 8.2 Write property test for review state machine
    - **Property 5: Review state machine validity**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [x] 9. Notification Module
  - [x] 9.1 Notification API তৈরি করো
    - `src/app/module/notification/notification.service.ts` — createNotification, getUserNotifications, markAsRead
    - Notification triggers in review workflow actions
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 9.2 Write property test for notification creation
    - **Property 7: Notification creation on review actions**
    - **Validates: Requirements 9.1, 9.2, 9.3**

- [x] 10. Backend Routes Wiring
  - `src/app/routes/index.ts` — সব module routes একসাথে wire করো
  - `src/app.ts` — Better Auth, CORS, middleware, routes সব setup করো
  - Backend checkpoint: সব endpoints Postman দিয়ে test করো
  - _Requirements: 1.4, 1.5_

- [x] 11. Backend Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
  - Backend server starts without errors
  - SuperAdmin seed works
  - Auth endpoints respond correctly
  - Company/FinancialYear CRUD works

- [x] 12. Next.js Frontend Setup
  - [x] 12.1 Next.js 15 project initialize করো `Assignment/` ফোল্ডারে
    - `package.json` — Next.js 15, TanStack Query, Axios, Zustand, shadcn/ui, Tailwind CSS
    - `next.config.ts`, `tsconfig.json` setup
    - `src/app/layout.tsx`, `src/app/globals.css`
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 12.2 Providers এবং HTTP client setup করো
    - `src/providers/QueryProvider.tsx` — TanStack Query provider
    - `src/lib/axios/httpClient.ts` — Axios instance with interceptors (401 → redirect to /auth)
    - `src/lib/authClient.ts` — Better Auth client
    - _Requirements: 10.2, 10.3, 10.8_

- [x] 13. Frontend Auth Integration
  - [x] 13.1 Auth service এবং pages তৈরি করো
    - `src/services/auth.service.ts` — signIn, signUp, signOut, getSession, verifyOTP
    - `src/app/auth/page.tsx` — Login/Register/OTP verification UI (Prototype এর AuthPage.tsx থেকে adapt করো)
    - Google OAuth button
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 10.7_

  - [x] 13.2 Auth middleware/guard তৈরি করো
    - `src/middleware.ts` — Next.js middleware for route protection
    - Session check on protected routes
    - _Requirements: 10.7, 10.8_

- [x] 14. Frontend Store এবং Services
  - [x] 14.1 Zustand store (UI state only) তৈরি করো
    - `src/store/useAppStore.ts` — শুধু activeCompanyId, activeYearId, currentUserId (no data)
    - _Requirements: 10.4, 11.2_

  - [x] 14.2 API services তৈরি করো
    - `src/services/company.service.ts` — getCompanies, createCompany, updateCompany, deleteCompany
    - `src/services/financialYear.service.ts` — getFinancialYears, createFinancialYear, deleteFinancialYear
    - `src/services/auditData.service.ts` — getYearData, saveAuditData, saveNotesData
    - `src/services/user.service.ts` — getUsers, updateUser, createAdmin
    - `src/services/notification.service.ts` — getNotifications, markAsRead
    - _Requirements: 11.1, 11.3_

- [x] 15. Frontend Dashboard Pages
  - [x] 15.1 Dashboard layout এবং sidebar তৈরি করো
    - `src/app/dashboard/layout.tsx` — DashboardLayout (Prototype থেকে adapt)
    - `src/components/dashboard/Sidebar.tsx` — role-aware navigation
    - _Requirements: 10.6, 10.9_

  - [x] 15.2 Company Dashboard তৈরি করো
    - `src/app/dashboard/my-companies/page.tsx` — CompanyDashboard
    - Company list, create, edit, delete
    - Financial year list per company, create, open, delete
    - TanStack Query for data fetching
    - _Requirements: 5.1, 5.2, 6.1, 10.9_

  - [x] 15.3 Admin Dashboard তৈরি করো
    - `src/app/dashboard/admin/page.tsx` — AdminDashboard
    - Review queue, student management, assignment controls
    - _Requirements: 4.3, 4.4, 8.2, 8.3, 10.9_

  - [x] 15.4 SuperAdmin Dashboard তৈরি করো
    - `src/app/dashboard/system/page.tsx` — SuperAdminDashboard
    - All users management, admin creation, system overview
    - _Requirements: 4.1, 4.2, 4.5, 4.6, 4.7, 10.9_

- [x] 16. Financial Statement Pages (fs/*)
  - [x] 16.1 useAuditData hook API-connected করো
    - `src/hooks/useAuditData.ts` — TanStack Query দিয়ে API থেকে data load করো
    - Auto-save on change (debounced PUT to API)
    - _Requirements: 7.3, 11.3, 11.4_

  - [x] 16.2 fs/* pages তৈরি করো
    - `src/app/fs/[tab]/page.tsx` — dynamic route for all tabs
    - সব existing tab components import করো (Cover, SFP, PNL, SCE, SCF, N4_13, PPE, P_Discussion)
    - Navigation component
    - Read-only banner for locked/blocked states
    - _Requirements: 10.5, 10.6, 6.6_

  - [x] 16.3 useGlobalStoreSync hook API-connected করো
    - `src/hooks/useGlobalStoreSync.ts` — notes data sync with API
    - _Requirements: 7.2, 11.3_

- [x] 17. Review Workflow UI
  - [x] 17.1 Review action components তৈরি করো
    - Submit button for students
    - Review action bar for admins/super admins (Start Review, Request Changes, Finalize, Reopen)
    - Status banner showing current review status
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 18. Notifications UI
  - [x] 18.1 Notification center তৈরি করো
    - Notification bell in sidebar/header
    - Notification list with mark-as-read
    - _Requirements: 9.5, 9.6, 9.7_

- [x] 19. Final Integration Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
  - Full flow test: Register → Verify OTP → Login → Create Company → Create Financial Year → Edit Audit Data → Submit → Review → Finalize
  - All existing Prototype functionality works identically
  - No broken routes or UI regressions

## Notes

- Tasks marked with `*` are optional (property-based tests) and can be skipped for faster MVP
- Backend এবং Frontend parallel করে develop করা যাবে
- Prototype এর সব UI component হুবহু copy করা হবে, শুধু data layer পরিবর্তন হবে
- Demo-File এর exact same coding patterns follow করতে হবে (catchAsync, sendResponse, checkAuth, validateRequest)
- Neon DATABASE_URL already `.env` file এ আছে
