# Implementation Plan: Audit-X UI Redesign

## Overview

Pure visual redesign — replace className strings, layout wrappers, and visual markup across 16 components and 1 CSS file. Work through files in the order listed below. Zero logic changes at any step.

## Tasks

- [x] 1. Apply global design system to `globals.css`
  - Add `:root` block with all Carbon & Cobalt CSS custom properties (surface colors, border colors, brand colors, text colors, status colors, sidebar colors)
  - Add Google Fonts `@import` for DM Sans and JetBrains Mono
  - Add `body` rule with `font-family: 'DM Sans'`, `background-color: var(--color-bg-base)`, and `-webkit-font-smoothing: antialiased`
  - Add `.glass-card`, `.gradient-text`, `.btn-brand`, and `.noise-overlay` utility class definitions
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.1 Write example tests for globals.css design tokens
    - **Property 1: CSS design tokens are defined**
    - **Property 2: Font imports are present**
    - **Property 3: Utility classes are defined**
    - **Validates: Requirements 1.1, 1.2, 1.4**

- [x] 2. Redesign landing page — Navbar
  - Replace the nav's visual structure: dark blurred backdrop, cobalt gradient logo icon, `text-[#8a9ab5]` nav links, cobalt CTA button with hover lift
  - Preserve all existing `<Link href>` and `<a href>` values
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.1 Write example test for Navbar href preservation
    - **Property 4: Landing page hrefs are preserved (Navbar)**
    - **Validates: Requirements 2.5**

- [x] 3. Redesign landing page — HeroSection
  - Replace section with `bg-[#0a0c10]`, grid pattern overlay, glow orbs, animated badge, gradient headline, dark dashboard mockup
  - Preserve `<Link href="/dashboard">` and `<a href="#features">`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.1 Write example test for HeroSection href preservation
    - **Property 4: Landing page hrefs are preserved (HeroSection)**
    - **Validates: Requirements 3.4**

- [x] 4. Redesign landing page — FeaturesSection, HowItWorksSection, CTASection, Footer
  - FeaturesSection: `bg-[#0a0c10]`, dark feature cards with hover glow, preserve features array data
  - HowItWorksSection: `bg-[#0d1018]`, gradient step bubbles, gradient connector line, preserve steps array data
  - CTASection: `bg-[#0a0c10]`, glow orbs, gradient headline, preserve `<Link href="/dashboard">`
  - Footer: `bg-[#0a0c10]`, 4-column grid, preserve all hrefs
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

  - [x] 4.1 Write example tests for CTA and Footer href preservation
    - **Property 4: Landing page hrefs are preserved (CTASection, Footer)**
    - **Validates: Requirements 6.3, 7.3**

- [x] 5. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [x] 6. Redesign auth page — `AuthPageClient.tsx`
  - Replace the JSX return statement: `bg-[#0a0c10]` background with grid pattern, animated glow orbs, dark card with `backdrop-blur-2xl` and shimmer top line, cobalt logo icon, dark inputs with `bg-[#161b25]`, cobalt gradient submit button, dark Google button
  - Keep all logic above the return statement completely unchanged (all state, all handlers, AnimatePresence blocks)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 6.1 Write example test for auth page logic preservation
    - **Property 5: Auth page logic is preserved**
    - **Validates: Requirements 8.6**

- [x] 7. Redesign dashboard shell — `DashboardLayoutClient.tsx`
  - Update outer wrapper to `bg-[#0a0c10]`, main to `bg-[#0f1117]`, loading spinner to `border-[#4f7df7]`
  - Preserve all useQuery, useEffect, and router redirect logic
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 8. Redesign sidebar — `SidebarNew.tsx`
  - Replace the return JSX: `bg-[#0d1018]` background, logo header, labeled nav sections with cobalt active states, company list with initial-letter avatars and hover-reveal edit icons, user footer with gradient avatar and role badge
  - Keep all hooks, mutations, and handlers above the return statement completely unchanged
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 8.1 Write example test for sidebar logic preservation
    - **Property 6: Sidebar logic is preserved**
    - **Validates: Requirements 10.6**

- [x] 9. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [x] 10. Redesign company dashboard — `CompanyDashboardClient.tsx`
  - Update background to `bg-[#0f1117]`, table container to `rounded-2xl border-white/[0.07]`, replace `statusStyles` with `statusConfig` using Carbon & Cobalt tokens, FY labels to `font-mono`, action buttons to cobalt styling, modals to dark with shimmer top line
  - Preserve all queries, mutations, state variables, and router calls
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 10.1 Write example test for company dashboard logic preservation
    - **Property 7: Dashboard logic is preserved (CompanyDashboardClient)**
    - **Validates: Requirements 11.6**

- [x] 11. Redesign admin dashboard — `AdminDashboardClient.tsx`
  - Update background to `bg-[#0f1117]`, title to plain white, table container to `rounded-2xl border-white/[0.07]`, company tags to cobalt pill badges, assign dropdown to dark styling
  - Preserve all queries, mutations, and role checks
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 11.1 Write example test for admin dashboard logic preservation
    - **Property 7: Dashboard logic is preserved (AdminDashboardClient)**
    - **Validates: Requirements 12.5**

- [x] 12. Redesign super admin dashboard — `SuperAdminDashboardClient.tsx`
  - Update background to `bg-[#0f1117]`, add "SYSTEM" danger badge next to title, update status badges to Carbon & Cobalt tokens with borders, update modal to dark with shimmer top line
  - Preserve all queries, mutations, confirm() dialog, and state
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [x] 12.1 Write example test for super admin dashboard logic preservation
    - **Property 7: Dashboard logic is preserved (SuperAdminDashboardClient)**
    - **Validates: Requirements 13.6**

- [x] 13. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [x] 14. Redesign notifications page — `src/app/dashboard/notifications/page.tsx`
  - Update background to `bg-[#0f1117]`, page header with cobalt bell icon in rounded container, unread cards with `bg-[#161b25]` and left cobalt accent bar, read cards with reduced opacity, "Mark all read" button with cobalt border styling
  - Preserve all queries and mutations
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 15. Redesign FS view action bar — `FSTabClient.tsx`
  - Update main wrapper to `bg-[#1a1f2e]`, action bar to `bg-[#0d1018]/95 border-white/[0.07]`, status badges to Carbon & Cobalt tokens with `font-mono`, read-only banner to `bg-amber-500/15 text-amber-300`, loading screen to `bg-[#0f1117]` with `border-[#4f7df7]` spinner
  - Preserve all hooks, mutations, renderTab(), and conditional logic
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 15.1 Write example test for FS view logic preservation
    - **Property 8: FS view logic is preserved**
    - **Validates: Requirements 15.5**

- [x] 16. Redesign FS tab navigation — `NavigationNew.tsx`
  - Replace footer bar: `bg-[#0d1018] border-white/[0.06]`, active tab with cobalt text and bottom underline indicator, inactive tabs with `text-[#8a9ab5]`, Dashboard home button with Home icon
  - Preserve all router.push() calls
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 16.1 Write example test for navigation route preservation
    - **Property 9: Navigation routes are preserved**
    - **Validates: Requirements 16.5**

- [x] 17. Final checkpoint — Ensure all tests pass, ask the user if questions arise.
  - Run `cd Frontend && npx vitest run` to confirm all example tests pass
  - Verify no `bg-white`, `bg-slate-50`, `bg-slate-100`, or `bg-[#F3F3F3]` remain as page-level backgrounds

## Notes

- All tasks are required — tests are included as part of each implementation step
- All tasks reference specific requirements for traceability
- Checkpoints ensure incremental validation after logical groups of changes
- The implementation order follows the checklist in the design brief: globals → landing → auth → dashboard shell → sidebar → dashboards → notifications → FS view
- Tests use Vitest with `fs.readFileSync` source-file string matching — no component rendering required
