# Audit-X Admin Panel Feature Analysis and Master Prompt

## 1. Current Codebase Reality

- Frontend stack: React 19 + TypeScript + Vite + Zustand + Immer + React Router.
- Data is currently stored in local persisted Zustand store (`src/store/useAppStore.ts`).
- Auth is currently lightweight email-based local auth with a single generic `User` type (`src/components/auth/AuthPage.tsx`).
- Dashboard currently supports:
  - user login/register
  - company create/edit
  - financial year create/open/delete
  - simple `in-progress` / `completed` year status
- Financial statement pages are opened through `/fs/*` and currently assume the active user can edit.

This means the new feature should be designed as an extension of the existing local store architecture, without changing the current financial statement UI structure unless access control requires small, additive changes.

## 2. Business Goal

Add a role-based administration system with:

- `student`
- `manager` = admin
- `partner` = super admin

The new system must support:

- student financial statement creation and editing
- manager financial statement creation and editing
- partner financial statement creation and editing
- review workflow after submit/complete
- final lock/unlock behavior
- user assignment
- role creation and delegation
- ban/unban
- delete controls
- access restrictions
- notifications
- clean admin and super admin dashboards

Constraint:

- existing features must keep working
- existing UI/UX should not be broken or heavily redesigned
- new panels should feel integrated with the current dashboard theme

## 3. Normalized Role Model

Use these canonical roles internally:

- `student`
- `admin`
- `super_admin`

Map business language:

- Manager = `admin`
- Partner = `super_admin`

## 4. Permission Matrix

### Student

- Can log in
- Can see only assigned companies / assigned financial years
- Can create and edit financials only if:
  - assigned
  - not banned
  - year is editable for them
- Can submit a financial year for review
- Cannot create admins or super admins
- Cannot ban/unban users
- Cannot delete accounts
- Cannot edit locked years

### Admin

- Can log in
- Can access admin panel
- Can create new financials like students
- Can review student-submitted financials
- Can mark review as complete/final
- Can uncomplete/unlock and return to editable state
- Can assign/unassign students
- Can ban/unban students
- Cannot delete accounts
- Cannot create/delete super admins
- Can only manage users/resources inside their permission scope

### Super Admin

- Full access to super admin panel
- Can create multiple admins
- Can create multiple super admins
- Can assign/unassign students
- Can assign/unassign admins
- Can review any submission
- Can finalize or unfinalize any allowed financial year
- Can ban/unban students and admins
- Can delete student/admin/super-admin accounts
- Can see system-wide overview and notifications

## 5. Financial Year Workflow

Replace the current simple year status with a review-aware workflow.

Recommended lifecycle:

- `draft`
- `submitted`
- `under_review`
- `changes_requested`
- `finalized`

Recommended meaning:

- `draft`: creator is actively editing
- `submitted`: student/admin/partner clicked Complete or Submit for Review
- `under_review`: admin or super admin opened review
- `changes_requested`: reviewer sent it back, creator can edit again
- `finalized`: reviewer completed review and the year becomes locked

## 6. Required Behavior From Your Description

### Submission flow

- Student works on a financial year.
- Student clicks `Complete`.
- The item becomes visible in review queues for:
  - assigned admin(s)
  - super admin(s)
- Admin and super admin can open the submission and review it.

### Locking flow

- If admin or super admin clicks final `Complete`, the financial year becomes locked.
- After that lock:
  - student cannot edit
  - admin cannot casually edit unless explicitly reopened
  - this becomes the final reviewed version

### Reopen flow

- If admin or super admin clicks `Uncomplete` / `Reopen` / `Request Changes`:
  - the year returns to editable state
  - student can edit again
  - the review status updates accordingly

### Manager/admin direct work

- Admin must also be able to create a new financial year and work on financials directly, same as student flow.

### Super admin delegation

- Super admin can create/manage multiple admins
- Admin can create/manage only students or only assigned students depending on chosen strictness

## 7. Missing Requirements You Should Include

These were implied but not fully specified. They should be included to avoid future breakage.

### A. Ownership metadata

Each financial year should store:

- who created it
- current assignee(s)
- current reviewer
- final reviewer
- final reviewed timestamp
- last updated by

### B. Audit trail

Track important actions:

- created
- submitted
- reopened
- finalized
- banned
- unbanned
- assigned
- unassigned
- deleted

### C. Notification center

Show lightweight in-app notifications for:

- new submission assigned to reviewer
- changes requested
- finalized
- banned/unbanned
- assignment changes

### D. Ban model

If banned:

- user can still log in
- user sees a blocked state
- user cannot edit or create
- user cannot access data they normally could
- show clear message: who banned them and why if available

### E. Delete safeguards

- Only super admin can delete accounts
- Delete must require confirmation
- Prefer soft delete for users in state model first

### F. Assignment rules

- Student must be assigned before seeing or editing a target company/year
- Admin assignment controls should be explicit
- Super admin can assign students to admins and optionally assign admins to companies

### G. Route guards

- protect dashboard routes by auth
- protect admin routes by role
- protect editing by role + status + ban state + assignment

## 8. Recommended Data Model Changes

Extend `src/store/useAppStore.ts`.

### User model

Suggested fields:

```ts
type UserRole = 'student' | 'admin' | 'super_admin';

interface UserNotification {
  id: string;
  type:
    | 'assignment'
    | 'review_submitted'
    | 'changes_requested'
    | 'finalized'
    | 'ban'
    | 'unban'
    | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedCompanyId?: string;
  relatedYearId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'banned' | 'deleted';
  bannedReason?: string;
  bannedByUserId?: string;
  profileImg?: string;
  companies: Company[];
  assignedCompanyIds: string[];
  assignedStudentIds?: string[];
  assignedAdminIds?: string[];
  notifications: UserNotification[];
}
```

### Financial year model

```ts
type ReviewStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'finalized';

interface ReviewEvent {
  id: string;
  type:
    | 'created'
    | 'submitted'
    | 'under_review'
    | 'changes_requested'
    | 'finalized'
    | 'reopened';
  actorUserId: string;
  actorRole: UserRole;
  note?: string;
  createdAt: string;
}

interface FinancialYear {
  id: string;
  year: number;
  reportingDate: string;
  status: 'in-progress' | 'completed';
  reviewStatus: ReviewStatus;
  isLocked: boolean;
  createdByUserId: string;
  assignedStudentIds: string[];
  assignedAdminIds: string[];
  currentReviewerUserId: string | null;
  finalizedByUserId: string | null;
  finalizedAt: string | null;
  submittedAt: string | null;
  lastEditedByUserId: string | null;
  reviewEvents: ReviewEvent[];
  data: FullYearData;
}
```

Note:

- keep existing `status` temporarily for backward compatibility
- eventually map `status` from `reviewStatus`

## 9. Recommended Access Rules

Create derived selectors/helpers instead of scattering logic.

Suggested helpers:

- `getCurrentUser()`
- `isBanned(user)`
- `isSuperAdmin(user)`
- `isAdmin(user)`
- `isStudent(user)`
- `canAccessCompany(user, company)`
- `canAccessFinancialYear(user, year, company)`
- `canEditFinancialYear(user, year, company)`
- `canReviewFinancialYear(user, year, company)`
- `canFinalizeFinancialYear(user, year, company)`
- `canManageUser(actor, target)`
- `canDeleteUser(actor, target)`

## 10. UI Design Direction

Keep the existing dark dashboard aesthetic.

Do not redesign the financial statement pages. Instead add:

- top status banner inside FS pages
- disabled overlay for locked/banned cases
- review action bar for admin/super-admin
- role badges in sidebar/profile
- admin/super-admin dashboard tabs

### Recommended new dashboard sections

#### Student dashboard

- My Companies
- My Assigned Financial Years
- Status chips: Draft / Submitted / Changes Requested / Finalized
- Notification panel

#### Admin dashboard

- Review Queue
- My Financial Years
- Assigned Students
- Student management table
- Ban/Unban controls
- Assignment tools

#### Super Admin dashboard

- All Review Queue
- Admin Management
- Super Admin Management
- Student Management
- Company Assignment
- System Activity
- Notification center

## 11. UX Rules To Keep It User Friendly

- Use additive changes only; do not move existing student editing tabs around
- Preserve current route structure where possible
- Keep `Dashboard -> Open Year -> /fs/*` flow intact
- Add clear status chips and disable reasons
- Never silently block actions
- Every disabled action must explain why:
  - banned
  - not assigned
  - locked after review
  - only reviewer can finalize

## 12. Recommended New Actions In Store

Examples:

- `createUser(name, email, role)`
- `updateUserRole(userId, role)`
- `banUser(userId, reason?)`
- `unbanUser(userId)`
- `softDeleteUser(userId)`
- `assignStudentToAdmin(studentId, adminId)`
- `unassignStudentFromAdmin(studentId, adminId)`
- `assignCompanyToUser(userId, companyId)`
- `submitFinancialYear(yearId, note?)`
- `startFinancialYearReview(yearId)`
- `requestFinancialYearChanges(yearId, note?)`
- `finalizeFinancialYear(yearId, note?)`
- `reopenFinancialYear(yearId, note?)`
- `markNotificationRead(notificationId)`
- `pushNotification(userId, notification)`

## 13. Edge Cases To Handle

- Existing users in localStorage without `role`
  - migrate them to `student`
- Existing years without review fields
  - migrate to `draft`, `isLocked = false`
- Banned user currently inside `/fs/*`
  - redirect or block editing immediately
- Finalized year currently open in edit page
  - show read-only state
- Deleted user referenced in historic review event
  - keep their name snapshot or handle gracefully
- Multiple admins assigned to same student/year
  - define whether any one admin can finalize or only assigned reviewer can

Recommended default:

- any assigned admin or any super admin may review
- once someone starts review, set `currentReviewerUserId`
- super admin can override

## 14. Migration Strategy

To avoid breaking current code:

1. Extend types first
2. Add backward-compatible migration inside store persistence rehydration
3. Add permission helpers/selectors
4. Add UI guards
5. Add admin/super-admin pages
6. Replace direct `markYearCompleted` usage with review actions
7. Keep old student flow working during transition

## 15. Important Product Decisions

These are the best defaults for your current app:

- default role for signup: `student`
- admin/super-admin creation should happen only from protected panels
- company ownership should remain with creator unless reassigned
- account deletion should be soft delete first
- finalized year should be read-only until admin/super-admin explicitly reopens it
- submitted year should be read-only for student unless changes are requested

## 16. Master Prompt For Implementation

Use the prompt below with a coding model/agent.

---

You are working inside an existing React 19 + TypeScript + Vite + Zustand audit application. Your job is to implement a new role-based administration and review workflow feature without breaking the existing student financial statement experience, routes, styling direction, or current business logic.

### Existing codebase facts

- Routing lives in `src/App.tsx`
- Auth UI lives in `src/components/auth/AuthPage.tsx`
- Main persisted app state lives in `src/store/useAppStore.ts`
- Dashboard layout lives in:
  - `src/components/dashboard/DashboardLayout.tsx`
  - `src/components/dashboard/Sidebar.tsx`
  - `src/components/dashboard/CompanyDashboard.tsx`
- Financial statement pages are under `src/components/tabs/*`
- Financial data loading uses `src/hooks/useAuditData.ts`
- Existing app uses Zustand persisted local state, not a backend API

### Goal

Add:

- `student` role
- `admin` role
- `super_admin` role

Business mapping:

- manager = `admin`
- partner = `super_admin`

### Hard constraints

- Do not break existing financial statement editing UI
- Do not redesign the entire app
- Keep current dashboard and `/fs/*` flow intact
- All new UI should match the existing dark modern dashboard styling
- Prefer additive changes over destructive refactors
- Preserve backward compatibility with existing persisted localStorage data

### Functional requirements

#### 1. Roles and access

- Signup default role is `student`
- `admin` and `super_admin` must be manageable through protected dashboard panels
- `student` can only access assigned resources
- `admin` can review student submissions, create their own financial years, assign/unassign students, and ban/unban students
- `super_admin` can manage admins, super admins, students, assignments, reviews, bans, unbans, and deletions

#### 2. Financial year review workflow

Implement review lifecycle:

- `draft`
- `submitted`
- `under_review`
- `changes_requested`
- `finalized`

Behavior:

- student/admin/super_admin can create and edit their own allowed financial years while status is editable
- when a student clicks Complete/Submit, the year becomes `submitted`
- assigned admins and super admins must see it in a review queue
- when admin/super_admin starts review, it becomes `under_review`
- if reviewer requests changes, it becomes `changes_requested` and student can edit again
- if reviewer finalizes/completes it, it becomes `finalized` and locked
- finalized years must be read-only until admin or super admin explicitly reopens them

#### 3. Locking and editing rules

- banned users can log in but cannot perform functional actions
- submitted years should not remain freely editable by student unless returned with changes requested
- finalized years are read-only
- show clear reason banners for read-only/blocked states

#### 4. Notifications

Add in-app notifications for:

- assignment
- review submitted
- changes requested
- finalized
- banned/unbanned

#### 5. Assignment rules

- super admin can assign students, admins, and optionally super admins where appropriate
- admin can assign/unassign students in their scope
- student must be assigned to access a company/year

#### 6. Delete rules

- only super admin can delete accounts
- implement soft delete first unless a very small isolated hard delete is already safer in this local-only app

### Implementation guidance

#### Data model

Extend the existing Zustand store types to include:

- user roles
- user status (`active`, `banned`, `deleted`)
- notifications
- assignment metadata
- financial year review metadata
- review event history

Add migration logic so old persisted data still loads.

#### Store architecture

Add selectors/helpers for permission checks rather than duplicating conditional logic in components.

Examples:

- `getCurrentUser`
- `canAccessFinancialYear`
- `canEditFinancialYear`
- `canReviewFinancialYear`
- `canManageTargetUser`
- `isUserBlocked`

#### UI

Update dashboard with role-aware panels:

- student dashboard
- admin dashboard
- super admin dashboard

Keep the visual language consistent with existing components.

Add:

- review queue tables/cards
- user management tables
- assignment controls
- ban/unban actions
- role badges
- notification list
- top-level financial year status banner
- review action bar inside FS pages or near the year header

#### Backward compatibility

Current `markYearCompleted` logic is too simple. Replace it carefully with review-aware actions, but do not break existing year opening/creation flow.

### Suggested implementation order

1. Extend and migrate the store models
2. Add permission helper selectors
3. Add role-aware auth/dashboard state
4. Add user management + assignment actions
5. Add review lifecycle actions
6. Add FS read-only guards and status banners
7. Add notifications
8. Run type-check and fix all regressions

### Expected output quality

- clean TypeScript types
- minimal unnecessary refactor
- readable store actions
- no broken routes
- no broken current student workflow
- no UI regression in existing financial tabs
- all new controls gated by role and status

### Also include

- concise inline comments only where logic is non-obvious
- migration-safe defaults for old persisted records
- clear disabled states and confirmation modals for destructive actions

At the end, provide a short summary of:

- files changed
- migration choices
- permission rules implemented
- any remaining limitations because the app is currently frontend-only/local-state-only

---

## 17. Final Recommendation

For this current codebase, the safest implementation strategy is:

- keep the existing FS editor untouched as much as possible
- move complexity into the Zustand store and dashboard-level permission wrappers
- treat review/finalization as metadata around a financial year, not a rewrite of the financial statement tabs

If you want, the next step should be:

- I convert this spec into a phased implementation checklist, or
- I implement the full feature directly in this codebase step by step.
