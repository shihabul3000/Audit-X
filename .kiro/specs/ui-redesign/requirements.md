# Requirements Document

## Introduction

A pure UI/visual redesign of the Audit-X SaaS platform. The goal is to replace the current mixed light/dark theme with a unified "Carbon & Cobalt" dark professional aesthetic — inspired by Vercel, Linear, and Resend — across all pages and components. Zero business logic, API calls, state management, routing, or data flow will be changed. Only className strings, layout wrappers, and visual markup are in scope.

## Glossary

- **Design System**: The set of CSS variables, typography rules, and reusable visual patterns defined in `globals.css` that all components must reference.
- **Carbon & Cobalt**: The name of the dark color palette using deep navy/charcoal backgrounds with cobalt-blue (`#4f7df7`) as the primary brand accent.
- **Glass Card**: A frosted-glass visual pattern using `backdrop-filter: blur` and semi-transparent backgrounds.
- **JetBrains Mono**: The monospace font used for financial figures, FY labels, and status codes.
- **DM Sans**: The primary sans-serif UI font used for all body and heading text.
- **Status Badge**: A small pill/chip element that displays a financial year's review status (Draft, Submitted, Under Review, Changes Requested, Finalized).
- **Landing Page**: The public-facing marketing page at `/`.
- **Auth Page**: The login/register/OTP page at `/auth`.
- **Dashboard Shell**: The persistent layout wrapper containing the sidebar and main content area.
- **FS View**: The financial statements editing view at `/fs/[tab]`.

---

## Requirements

### Requirement 1: Global Design System

**User Story:** As a developer, I want a single source of truth for design tokens, so that all components share a consistent visual language.

#### Acceptance Criteria

1. THE `globals.css` file SHALL define all CSS custom properties for the Carbon & Cobalt color palette under `:root`, including surface colors (`--color-bg-base`, `--color-bg-surface`, `--color-bg-elevated`, `--color-bg-overlay`, `--color-bg-subtle`), border colors, brand colors, text colors, status colors, and sidebar colors as specified.
2. THE `globals.css` file SHALL import DM Sans and JetBrains Mono from Google Fonts.
3. THE `globals.css` file SHALL apply `font-family: 'DM Sans', sans-serif` and `background-color: var(--color-bg-base)` to the `body` element.
4. THE `globals.css` file SHALL define the `.glass-card`, `.gradient-text`, `.btn-brand`, and `.noise-overlay` utility classes.
5. WHEN a monospace context is needed (financial figures, FY labels, status codes), THE component SHALL apply `font-family: 'JetBrains Mono', monospace` via the `font-mono` Tailwind class or `[data-mono]` attribute.

---

### Requirement 2: Landing Page — Navbar

**User Story:** As a visitor, I want a sleek dark navigation bar, so that the first impression of the product feels premium and professional.

#### Acceptance Criteria

1. THE `Navbar` component SHALL render a fixed top bar with a blurred dark backdrop (`bg-[#0a0c10]/80 backdrop-blur-xl`) and a subtle bottom border.
2. THE `Navbar` component SHALL display the Audit-X logo with a cobalt-blue gradient icon (`ShieldCheck`) and the brand name with `-X` in `text-[#4f7df7]`.
3. THE `Navbar` component SHALL render navigation links ("Features", "How it Works") with `text-[#8a9ab5]` color that transitions to white on hover.
4. THE `Navbar` component SHALL render a "Get Started" CTA button linking to `/auth` with cobalt-blue background and hover lift effect.
5. THE `Navbar` component SHALL preserve all existing `<Link href>` and `<a href>` values unchanged.

---

### Requirement 3: Landing Page — Hero Section

**User Story:** As a visitor, I want an atmospheric dark hero section, so that the product communicates a premium, modern SaaS identity.

#### Acceptance Criteria

1. THE `HeroSection` component SHALL render a full-viewport dark section (`bg-[#0a0c10]`) with a subtle grid pattern overlay and atmospheric glow orbs.
2. THE `HeroSection` component SHALL display an animated badge, a large gradient headline, a subtitle in `text-[#8a9ab5]`, and two CTA buttons.
3. THE `HeroSection` component SHALL render a dashboard preview mockup with a dark window chrome, a mock sidebar, and mock table rows.
4. THE `HeroSection` component SHALL preserve the existing `<Link href="/dashboard">` and `<a href="#features">` links.
5. WHEN the page loads, THE `HeroSection` component SHALL animate elements in sequentially using `motion.div` with staggered `delay` values.

---

### Requirement 4: Landing Page — Features Section

**User Story:** As a visitor, I want a dark feature grid, so that I can understand the product's capabilities in a visually engaging way.

#### Acceptance Criteria

1. THE `FeaturesSection` component SHALL render on a `bg-[#0a0c10]` background with a section header using the cobalt-blue uppercase label pattern.
2. THE `FeaturesSection` component SHALL render each feature in a dark card (`bg-[#0f1117]`) with a border, hover lift, and a radial glow effect on hover.
3. THE `FeaturesSection` component SHALL preserve all existing `features` array data (titles, descriptions, icons) unchanged.
4. WHEN a feature card enters the viewport, THE `FeaturesSection` component SHALL animate it in using `whileInView` with staggered delays.

---

### Requirement 5: Landing Page — How It Works Section

**User Story:** As a visitor, I want a dark step-by-step workflow section, so that I can understand the product's process clearly.

#### Acceptance Criteria

1. THE `HowItWorksSection` component SHALL render on a `bg-[#0d1018]` background with a gradient connector line between steps on desktop.
2. THE `HowItWorksSection` component SHALL render each step with a gradient number bubble and colored box-shadow matching the step's accent color.
3. THE `HowItWorksSection` component SHALL preserve all existing `steps` array data (step numbers, titles, descriptions) unchanged.
4. THE `HowItWorksSection` component SHALL include a bottom CTA card with a dark background and a "Watch Walkthrough" button.

---

### Requirement 6: Landing Page — CTA Section

**User Story:** As a visitor, I want a compelling dark call-to-action section, so that I am motivated to start using the product.

#### Acceptance Criteria

1. THE `CTASection` component SHALL render on a `bg-[#0a0c10]` background with atmospheric glow orbs in the corners.
2. THE `CTASection` component SHALL display a gradient headline, an emerald badge, and a gradient "Get Started Now" button.
3. THE `CTASection` component SHALL preserve the existing `<Link href="/dashboard">` link unchanged.

---

### Requirement 7: Landing Page — Footer

**User Story:** As a visitor, I want a dark footer with clear navigation links, so that I can find product and legal information easily.

#### Acceptance Criteria

1. THE `Footer` component SHALL render on a `bg-[#0a0c10]` background with a top border and a 4-column grid layout.
2. THE `Footer` component SHALL display the brand logo, a product links column, and a legal links column.
3. THE `Footer` component SHALL preserve all existing `<a href>` and `<Link href>` values unchanged.

---

### Requirement 8: Auth Page

**User Story:** As a user, I want a dark, premium authentication page, so that the login/register experience feels consistent with the rest of the product.

#### Acceptance Criteria

1. THE `AuthPageClient` component SHALL render a dark full-screen background (`bg-[#0a0c10]`) with a grid pattern and animated glow orbs.
2. THE `AuthPageClient` component SHALL render the auth card with `bg-[#0f1117]/90 backdrop-blur-2xl`, a rounded-2xl border, and a top shimmer gradient line.
3. THE `AuthPageClient` component SHALL render all input fields with `bg-[#161b25]` background, `border-white/[0.08]` border, and `focus:border-[#4f7df7]` focus state.
4. THE `AuthPageClient` component SHALL render the primary submit button with a cobalt-to-indigo gradient and shadow.
5. THE `AuthPageClient` component SHALL render the Google sign-in button with `bg-[#161b25]` background and `border-white/[0.08]` border.
6. THE `AuthPageClient` component SHALL preserve all existing state variables, event handlers (`handleLogin`, `handleRegister`, `handleVerifyOTP`, `handleGoogleLogin`), `AnimatePresence` blocks, and form `onSubmit` handlers completely unchanged.

---

### Requirement 9: Dashboard Shell

**User Story:** As an authenticated user, I want a dark dashboard layout, so that the workspace feels cohesive and professional.

#### Acceptance Criteria

1. THE `DashboardLayoutClient` component SHALL render the outer wrapper with `bg-[#0a0c10]` and the main content area with `bg-[#0f1117]`.
2. THE `DashboardLayoutClient` component SHALL preserve all existing `useQuery`, `useEffect`, and router redirect logic unchanged.
3. WHEN the dashboard is loading, THE `DashboardLayoutClient` component SHALL display a centered spinner using `border-[#4f7df7]` color.

---

### Requirement 10: Sidebar

**User Story:** As an authenticated user, I want a dark sidebar with clear navigation sections, so that I can navigate between companies and management pages efficiently.

#### Acceptance Criteria

1. THE `SidebarNew` component SHALL render with `bg-[#0d1018]` background and `border-white/[0.06]` right border.
2. THE `SidebarNew` component SHALL display a logo header, a scrollable navigation area with labeled sections ("Management", "Companies"), and a user footer.
3. THE `SidebarNew` component SHALL render active navigation items with `bg-[#4f7df7]/10 text-[#4f7df7] border border-[#4f7df7]/20` styling and inactive items with `text-[#8a9ab5]`.
4. THE `SidebarNew` component SHALL render company list items with an initial-letter avatar badge and a hover-reveal edit pencil icon.
5. THE `SidebarNew` component SHALL render the user footer with a gradient avatar, a role badge in cobalt-blue, a notification bell with unread count badge, and a sign-out button.
6. THE `SidebarNew` component SHALL preserve all existing query hooks, mutations, `handleSignOut`, `createMutation`, `updateMutation`, `router.push()` calls, `setActiveCompany`, and `unreadCount` calculation completely unchanged.

---

### Requirement 11: Company Dashboard

**User Story:** As a user, I want a premium dark financial year table, so that I can manage and navigate financial years clearly.

#### Acceptance Criteria

1. THE `CompanyDashboardClient` component SHALL render with `bg-[#0f1117]` background and a page header showing the company name with a cobalt-blue subtitle label.
2. THE `CompanyDashboardClient` component SHALL render the financial years table inside a `bg-[#0f1117] border border-white/[0.07] rounded-2xl` container.
3. THE `CompanyDashboardClient` component SHALL render status badges using the `statusConfig` mapping with `font-mono` text and pill-shaped borders for each review status.
4. THE `CompanyDashboardClient` component SHALL render the "Continue"/"View" action button with `bg-[#4f7df7]/10 text-[#4f7df7]` styling and a hover fill effect.
5. THE `CompanyDashboardClient` component SHALL render the delete confirmation modal with a `border-red-500/[0.15]` border and a red shimmer top line.
6. THE `CompanyDashboardClient` component SHALL preserve all existing queries, mutations, `setActiveYear`, `router.push('/fs/cover')`, `showModal`, `deleteTarget`, `modalError`, and `newDate` state completely unchanged.

---

### Requirement 12: Admin Dashboard

**User Story:** As an admin, I want a dark firm management table, so that I can assign companies to students in a clean interface.

#### Acceptance Criteria

1. THE `AdminDashboardClient` component SHALL render with `bg-[#0f1117]` background and a plain white page title (no gradient).
2. THE `AdminDashboardClient` component SHALL render the student assignments table inside a `rounded-2xl border border-white/[0.07]` container with dark header row.
3. THE `AdminDashboardClient` component SHALL render assigned company tags as cobalt-blue pill badges with a hover-reveal unassign button.
4. THE `AdminDashboardClient` component SHALL render the assign dropdown with `bg-[#161b25]` background and `focus:border-[#4f7df7]` focus state.
5. THE `AdminDashboardClient` component SHALL preserve all existing queries, mutations, `assignMutation`, `unassignMutation`, `router.push`, `setActiveCompany`, and role checks completely unchanged.

---

### Requirement 13: Super Admin Dashboard

**User Story:** As a super admin, I want a dark system governance table, so that I can manage all users with clear visual hierarchy.

#### Acceptance Criteria

1. THE `SuperAdminDashboardClient` component SHALL render with `bg-[#0f1117]` background and a page title with a "SYSTEM" danger badge.
2. THE `SuperAdminDashboardClient` component SHALL render the users table inside a `rounded-2xl border border-white/[0.07]` container.
3. THE `SuperAdminDashboardClient` component SHALL render status badges for Active (emerald), Banned (red), and Deleted (slate) using the specified color tokens.
4. THE `SuperAdminDashboardClient` component SHALL render the "Create Admin" button with `bg-violet-600` styling.
5. THE `SuperAdminDashboardClient` component SHALL render the create modal with `bg-[#0f1117]` background, `border-white/[0.08]` border, and a top shimmer line.
6. THE `SuperAdminDashboardClient` component SHALL preserve all existing queries, mutations, `updateMutation`, `deleteMutation`, `createMutation`, `showCreateAdmin` state, `createForm` state, and `confirm()` dialog completely unchanged.

---

### Requirement 14: Notifications Page

**User Story:** As a user, I want a dark notifications list, so that I can review audit workflow updates in a clean interface.

#### Acceptance Criteria

1. THE notifications page SHALL render with `bg-[#0f1117]` background and a page header with a cobalt-blue bell icon in a rounded container.
2. THE notifications page SHALL render unread notifications as `bg-[#161b25]` cards with a `border-[#4f7df7]/15` border and a left cobalt-blue accent bar.
3. THE notifications page SHALL render read notifications as `bg-[#0f1117]` cards with reduced opacity.
4. THE notifications page SHALL render the "Mark all read" button with cobalt-blue styling and a border.
5. THE notifications page SHALL preserve all existing queries, mutations, `markReadMutation`, and `markAllReadMutation` completely unchanged.

---

### Requirement 15: Financial Statements View — Action Bar

**User Story:** As a user, I want a dark action bar in the FS view, so that I can see the review status and take actions without visual disruption.

#### Acceptance Criteria

1. THE `FSTabClient` component SHALL render the review action bar with `bg-[#0d1018]/95 border-b border-white/[0.07]` styling.
2. THE `FSTabClient` component SHALL render status badges using the Carbon & Cobalt status color tokens with `font-mono` text.
3. THE `FSTabClient` component SHALL render the read-only warning banner with `bg-amber-500/15 border-amber-500/25 text-amber-300` styling.
4. THE `FSTabClient` component SHALL render the loading screen with `bg-[#0f1117]` background and a `border-[#4f7df7]` spinner.
5. THE `FSTabClient` component SHALL preserve all existing `useAuditDataAPI`, `useGlobalStoreSync`, `renderTab()`, `submitMutation`, `reviewActionMutation`, and all conditional logic completely unchanged.

---

### Requirement 16: Financial Statements View — Tab Navigation

**User Story:** As a user, I want a dark tab navigation bar at the bottom of the FS view, so that switching between financial statement tabs feels native to the dark theme.

#### Acceptance Criteria

1. THE `NavigationNew` component SHALL render a footer bar with `bg-[#0d1018] border-t border-white/[0.06]` styling, replacing the current Excel-style gray bar.
2. THE `NavigationNew` component SHALL render the active tab with `text-[#4f7df7] bg-[#4f7df7]/[0.07]` and a bottom cobalt-blue underline indicator.
3. THE `NavigationNew` component SHALL render inactive tabs with `text-[#8a9ab5]` and a white hover state.
4. THE `NavigationNew` component SHALL render a "Dashboard" home button as the first item with a `Home` icon.
5. THE `NavigationNew` component SHALL preserve all existing `router.push('/fs/${tab.toLowerCase()}')` and `router.push('/dashboard/my-companies')` navigation calls completely unchanged.

---

### Requirement 17: Responsive Design

**User Story:** As a user on any device, I want all redesigned pages to be usable on mobile, so that the product works across screen sizes.

#### Acceptance Criteria

1. THE landing page components SHALL use responsive Tailwind breakpoints (`sm:`, `md:`, `lg:`) to stack layouts vertically on mobile.
2. THE auth page SHALL render the card full-width on small screens with appropriate padding.
3. THE dashboard sidebar SHALL remain functional on screens where it is visible (desktop-first layout is acceptable for the dashboard).

---

### Requirement 18: No Logic Changes

**User Story:** As a developer, I want zero functional regressions, so that the redesign does not break any existing features.

#### Acceptance Criteria

1. THE redesign SHALL NOT modify any API call functions, query keys, mutation functions, or service layer files.
2. THE redesign SHALL NOT modify any route paths, `router.push()` calls, or `<Link href>` values.
3. THE redesign SHALL NOT modify any conditional logic, role checks, or state variable declarations.
4. THE redesign SHALL NOT modify any form `onSubmit` handlers, `onChange` handlers, or `disabled` prop logic.
5. THE redesign SHALL NOT add any new npm dependencies beyond what is already installed.
6. THE redesign SHALL use only Tailwind CSS classes and the CSS custom properties defined in `globals.css` — no new CSS files shall be created.
