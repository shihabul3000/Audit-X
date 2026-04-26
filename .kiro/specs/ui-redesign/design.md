# Design Document: Audit-X UI Redesign

## Overview

This is a pure visual redesign of the Audit-X frontend. The scope is limited to replacing `className` strings, layout wrappers, and visual markup across 16 components and 1 CSS file. No business logic, API calls, state management, routing, hooks, or data flow will be touched.

The new aesthetic is "Carbon & Cobalt" — a dark professional theme using deep navy/charcoal surfaces with cobalt-blue (`#4f7df7`) as the primary brand accent, inspired by Vercel, Linear, and Resend.

---

## Architecture

The redesign is purely presentational. The existing component architecture is unchanged:

```
Frontend/
├── src/app/globals.css              ← Design tokens + font imports
├── src/components/landing/          ← 6 landing page components
├── src/components/auth/             ← Auth page
├── src/components/dashboard/        ← Dashboard shell + sidebar + 3 dashboards
├── src/components/fs/               ← FS view action bar + tab navigation
└── src/app/dashboard/notifications/ ← Notifications page
```

All components remain client components (`'use client'`). No new files are created. No new dependencies are added.

---

## Components and Interfaces

### 1. `globals.css`

The single source of truth for all design tokens. All components reference these via Tailwind's arbitrary value syntax (e.g., `bg-[#0a0c10]`) or the CSS custom properties directly.

**Changes:**
- Add `:root` block with all Carbon & Cobalt CSS variables
- Add Google Fonts import for DM Sans and JetBrains Mono
- Add `body` rule with `font-family`, `background-color`, and `-webkit-font-smoothing`
- Add `.glass-card`, `.gradient-text`, `.btn-brand`, `.noise-overlay` utility classes

### 2. Landing Page Components (6 files)

| Component | Key Visual Change |
|---|---|
| `Navbar.tsx` | White → dark blurred bar; indigo → cobalt brand colors |
| `HeroSection.tsx` | Light slate bg → `#0a0c10`; light mockup → dark mockup |
| `FeaturesSection.tsx` | White cards → dark `#0f1117` cards with hover glow |
| `HowItWorksSection.tsx` | Light slate bg → `#0d1018`; white step cards → gradient bubbles |
| `CTASection.tsx` | Indigo-900 bg → `#0a0c10`; emerald CTA → gradient cobalt CTA |
| `Footer.tsx` | Already dark (`slate-950`) → updated to `#0a0c10` with new token colors |

### 3. `AuthPageClient.tsx`

The JSX return statement is restructured. All logic above the return statement is untouched. Key visual changes:
- Background: `slate-950` → `#0a0c10` with grid pattern
- Card: `slate-900/60` → `#0f1117/90` with `backdrop-blur-2xl`
- Inputs: `slate-950/50 border-slate-800` → `#161b25 border-white/[0.08]`
- Submit button: `indigo-600 to blue-600` → `#4f7df7 to #6366f1`
- Google button: `slate-800/80` → `#161b25`

### 4. `DashboardLayoutClient.tsx`

Minimal changes — only the wrapper `className` strings:
- Outer div: `bg-[#121212]` → `bg-[#0a0c10]`
- Main: no explicit bg → `bg-[#0f1117]`
- Loading screen: `bg-[#121212]` → `bg-[#0f1117]`, spinner `border-blue-500` → `border-[#4f7df7]`

### 5. `SidebarNew.tsx`

Full visual overhaul of the return JSX. Logic block (all hooks, mutations, handlers) is untouched:
- Background: `#1a1a1a` → `#0d1018`
- Active nav items: `bg-blue-600/20 border-blue-500/30` → `bg-[#4f7df7]/10 border-[#4f7df7]/20`
- Company items: solid `bg-blue-600` active → `bg-[#4f7df7]/10` with border
- User footer: `#161616` → `#0a0c10/60`
- Role badge: `bg-blue-500/20 text-blue-400` → `bg-[#4f7df7]/15 text-[#4f7df7] border border-[#4f7df7]/20`

### 6. `CompanyDashboardClient.tsx`

Visual overhaul of the return JSX. All state and mutation logic untouched:
- Background: `#121212` → `#0f1117`
- Table container: `#1a1a1a border-gray-800` → `#0f1117 border-white/[0.07] rounded-2xl`
- Status badges: replace `statusStyles` Record with `statusConfig` using the Carbon & Cobalt status tokens
- FY label: plain text → `font-mono font-semibold`
- Modals: `#1e1e1e border-gray-800` → `#0f1117 border-white/[0.08]` with shimmer top line

### 7. `AdminDashboardClient.tsx`

Visual overhaul of the return JSX:
- Background: `#121212` → `#0f1117`
- Title: gradient text → plain `text-white`
- Table container: `#1a1a1a border-gray-800` → `#0f1117 border-white/[0.07] rounded-2xl`
- Company tags: `bg-blue-900/40 border-blue-800/50` → `bg-[#4f7df7]/10 border-[#4f7df7]/20`
- Assign dropdown: `bg-black border-gray-700` → `bg-[#161b25] border-white/[0.08]`

### 8. `SuperAdminDashboardClient.tsx`

Visual overhaul of the return JSX:
- Background: `#121212` → `#0f1117`
- Title: red/purple gradient → plain white + "SYSTEM" danger badge
- Create button: `bg-purple-600` (kept, already correct)
- Status badges: updated to use Carbon & Cobalt tokens with border
- Modal: `#1e1e1e border-gray-800` → `#0f1117 border-white/[0.08]` with shimmer

### 9. `notifications/page.tsx`

Visual overhaul of the return JSX:
- Background: `#121212` → `#0f1117`
- Page header: plain `<Bell>` icon → icon in a cobalt-blue rounded container
- Unread cards: `#1e2a3a border-blue-800/50` → `#161b25 border-[#4f7df7]/15` with left accent bar
- Read cards: `#1a1a1a border-gray-800` → `#0f1117 border-white/[0.05]`
- Mark all read button: plain text → cobalt-blue bordered button

### 10. `FSTabClient.tsx`

Visual overhaul of the action bar and loading screen:
- Action bar: `#1a1a1a/95 border-gray-700` → `#0d1018/95 border-white/[0.07]`
- Status badges: updated to Carbon & Cobalt tokens
- Read-only banner: `bg-amber-500/90 text-amber-950` → `bg-amber-500/15 border-amber-500/25 text-amber-300`
- Loading screen: `#808080` → `#0f1117`, spinner `border-white` → `border-[#4f7df7]`
- Main wrapper: `bg-[#808080]` → `bg-[#1a1f2e]` (warmer dark for document editing context)

### 11. `NavigationNew.tsx`

Full visual replacement of the Excel-style gray tab bar:
- Background: `#F3F3F3 border-gray-300` → `#0d1018 border-white/[0.06]`
- Active tab: `bg-white text-[#107C41] border-b-[#107C41]` → `text-[#4f7df7] bg-[#4f7df7]/[0.07]` with bottom cobalt underline
- Inactive tabs: `text-gray-600 hover:bg-gray-200` → `text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]`
- Dashboard button: `text-gray-600 hover:bg-emerald-600` → `text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]`

---

## Data Models

No data model changes. This redesign is purely presentational. All TypeScript interfaces, Prisma schemas, and API response shapes remain identical.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Because this is a pure visual redesign, the correctness properties are all example-based rather than universally quantified over arbitrary inputs. The key correctness concerns are:

1. **Design token completeness** — the CSS file must define all required variables
2. **Route/href preservation** — no navigation links may be changed
3. **Logic preservation** — all handler function names and state variables must survive the refactor

### Property 1: CSS design tokens are defined

*For the specific file `globals.css`*, after the redesign, it must contain all required CSS custom property names under `:root`.

Key variables to verify: `--color-bg-base`, `--color-bg-surface`, `--color-bg-elevated`, `--color-brand-primary`, `--color-text-primary`, `--color-text-secondary`, `--color-sidebar-bg`.

**Validates: Requirements 1.1**

### Property 2: Font imports are present

*For the specific file `globals.css`*, after the redesign, it must contain an `@import` for Google Fonts with both `DM+Sans` and `JetBrains+Mono`.

**Validates: Requirements 1.2**

### Property 3: Utility classes are defined

*For the specific file `globals.css`*, after the redesign, it must contain the `.glass-card`, `.gradient-text`, `.btn-brand`, and `.noise-overlay` class definitions.

**Validates: Requirements 1.4**

### Property 4: Landing page hrefs are preserved

*For each landing page component* (`Navbar`, `HeroSection`, `CTASection`, `Footer`), the href values present before the redesign must still be present after the redesign. Specifically:
- `Navbar`: `/auth`, `#features`, `#how-it-works`
- `HeroSection`: `/dashboard`, `#features`
- `CTASection`: `/dashboard`
- `Footer`: `#features`, `#how-it-works`, `/dashboard`

**Validates: Requirements 2.5, 3.4, 6.3, 7.3**

### Property 5: Auth page logic is preserved

*For the specific file `AuthPageClient.tsx`*, after the redesign, the source must still contain all original handler and state identifiers: `handleLogin`, `handleRegister`, `handleVerifyOTP`, `handleGoogleLogin`, `redirectByRole`, `setMode`, `setEmail`, `setName`, `setPassword`, `setOtp`, `setLoading`.

**Validates: Requirements 8.6**

### Property 6: Sidebar logic is preserved

*For the specific file `SidebarNew.tsx`*, after the redesign, the source must still contain: `createMutation`, `updateMutation`, `handleSignOut`, `setActiveCompany`, `unreadCount`, `router.push`.

**Validates: Requirements 10.6**

### Property 7: Dashboard logic is preserved

*For each dashboard component* (`CompanyDashboardClient`, `AdminDashboardClient`, `SuperAdminDashboardClient`), after the redesign, the source must still contain all original mutation and query identifiers.

**Validates: Requirements 11.6, 12.5, 13.6**

### Property 8: FS view logic is preserved

*For the specific file `FSTabClient.tsx`*, after the redesign, the source must still contain: `useAuditDataAPI`, `useGlobalStoreSync`, `renderTab`, `submitMutation`, `reviewActionMutation`.

**Validates: Requirements 15.5**

### Property 9: Navigation routes are preserved

*For the specific file `NavigationNew.tsx`*, after the redesign, the source must still contain the route strings `/fs/` and `/dashboard/my-companies`.

**Validates: Requirements 16.5**

### Property 10: Dark background classes are applied

*For each redesigned component*, the primary background className must use the Carbon & Cobalt dark palette rather than the old light or mixed values. Specifically, no component should use `bg-white`, `bg-slate-50`, `bg-slate-100`, or `bg-[#F3F3F3]` as a page-level background after the redesign.

**Validates: Requirements 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.4, 16.1**

---

## Error Handling

No new error handling is introduced. All existing error handling (toast notifications, error state rendering, fallback UI) is preserved exactly as-is. The visual styling of error states is updated to match the dark theme (e.g., error banners use `bg-red-500/10 border-red-500/20 text-red-400` instead of light red backgrounds).

---

## Testing Strategy

### Dual Testing Approach

**Unit/Example Tests** verify that specific, concrete conditions hold after the redesign:
- CSS file contains required design tokens
- Href values are unchanged in landing components
- Handler function names are preserved in logic-heavy components
- Old light-theme background classes are absent from page-level wrappers

**Property-Based Tests** are not applicable here because the inputs are fixed (specific files, specific class names) — there is no meaningful input space to randomize over. All correctness properties above are example-based.

### Test Implementation

Tests will be written using **Vitest** (already installed in the Frontend workspace via `vite.config.ts`). Tests will use simple string-matching against the source file contents (read via `fs.readFileSync`) rather than rendering components, keeping tests fast and dependency-free.

Each test file will be co-located or placed in a `__tests__` directory. The test suite will be runnable with:

```bash
cd Frontend && npx vitest run
```

**Test tag format:** `// Feature: ui-redesign, Property {N}: {property_text}`

### Test Coverage Plan

| Test | Type | Property |
|---|---|---|
| `globals.css` contains all CSS variables | Example | Property 1 |
| `globals.css` contains font import | Example | Property 2 |
| `globals.css` contains utility classes | Example | Property 3 |
| Landing hrefs are preserved | Example | Property 4 |
| Auth handlers are preserved | Example | Property 5 |
| Sidebar logic identifiers are preserved | Example | Property 6 |
| Dashboard logic identifiers are preserved | Example | Property 7 |
| FS view logic identifiers are preserved | Example | Property 8 |
| Navigation routes are preserved | Example | Property 9 |
| No light-theme bg classes on page wrappers | Example | Property 10 |

### Unit Test Balance

- Tests focus on the highest-risk regressions: broken navigation and lost business logic
- Tests do not attempt to render components (avoids complex Next.js/React test setup overhead)
- Source-file string matching is sufficient for this class of visual-only changes
