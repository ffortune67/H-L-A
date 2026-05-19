# Refactoring Plan: H-L-A Organization Website
Generated: 2026-05-18
Stack: react-spa

## Phase 1: Establish Core Architecture Directories
**Goal**: Create the missing foundational directories (services, hooks, components) so API calls can be centralized and data fetching can be reusable.
**Risk**: low

### Steps
- [x] Step 1.1: Create `src/services/` directory and API client
  - What: Create new files:
    - `src/services/api.ts` - Base API client with URL config, auth headers, error handling
    - `src/services/donations.ts` - Donation-related API calls (POST /donations, POST /payments/bank-transfer, GET /payments/methods/bank)
    - `src/services/admin.ts` - Admin dashboard API calls (GET /admin/dashboard)
  - Why: Centralizes all HTTP requests in one place, making it easy to add auth headers, error normalization, and request retries. Required by React SPA blueprint.
  - Imports to update: Will be done in Phase 3
  - Verify: `ls -la src/services/` should show 3 files

- [x] Step 1.2: Create `src/hooks/` directory with data fetching hooks
  - What: Create new files:
    - `src/hooks/useFetch.ts` - Generic fetch hook for reusable data fetching patterns
    - `src/hooks/useDonationForm.ts` - Hook encapsulating donation form state and submission logic
    - `src/hooks/useAdminDashboard.ts` - Hook for admin dashboard data fetching and state
  - Why: Custom hooks let pages focus on rendering while hooks manage side effects and data fetching. This makes code reusable and testable.
  - Imports to update: Will be done in Phase 3

- [x] Step 1.3: Create `src/components/` directory for reusable presentational components
  - What: Create new directory `src/components/` (separate from `src/app/components/` which contains UI library exports)
  - Why: React SPA blueprint requires a `src/components/` directory for reusable components shared across multiple pages. Currently `src/app/components/` mixes UI library re-exports with custom components like Layout.
  - Imports to update: Will be done in Phase 2

## Phase 2: Move Inline API Calls into Services
**Goal**: Extract fetch/axios calls from pages and consolidate in services layer.
**Risk**: medium (touches multiple pages; must verify API contracts unchanged)

### Steps
- [x] Step 2.1: Extract Donations page API calls to `src/services/donations.ts`
  - What: Move from `src/app/pages/Donations.tsx` (lines 51-110):
    - POST to `${API_URL}/api/donations` (form submission, lines 51-71)
    - POST to `${API_URL}/api/payments/bank-transfer` (lines 84-104)
    - GET to `${API_URL}/api/payments/methods/bank` (lines 106-109)
  - Why: Donations.tsx currently makes 3 sequential fetch calls inline. Moving to `services/donations.ts` makes the logic reusable and separates API concerns from UI rendering.
  - Imports to update:
    - `src/app/pages/Donations.tsx`: Remove fetch calls, import from `src/services/donations.ts` instead
  - Verify: `grep -r "fetch.*api/donations" src/app/pages/` should return zero results

- [x] Step 2.2: Extract AdminDashboard API calls to `src/services/admin.ts`
  - What: Move from `src/app/pages/AdminDashboard.tsx` (lines 14-32):
    - GET to `${API_URL}/api/admin/dashboard` with Authorization header
    - Move axios instance creation/configuration
  - Why: AdminDashboard currently fetches data inline in useEffect. Moving to a service function makes this call reusable and centralizes auth header logic.
  - Imports to update:
    - `src/app/pages/AdminDashboard.tsx`: Replace axios import with import from `src/services/admin.ts`
  - Verify: `grep -r "axios.get.*admin/dashboard" src/` should return zero results

- [x] Step 2.3: Consolidate API_URL configuration
  - What: Create `src/config/api.ts` with:
    - `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'`
    - Export from this single location
  - Why: API_URL is currently defined inline in multiple files (Donations.tsx:23, AdminDashboard.tsx:5). Centralizing makes it easy to change base URL globally.
  - Imports to update:
    - `src/services/api.ts`: import from `src/config/api.ts`
    - `src/services/donations.ts`: import from `src/config/api.ts`
    - `src/services/admin.ts`: import from `src/config/api.ts`
    - Remove inline `API_URL` definitions from pages

## Phase 3: Extract Custom Hooks for Reusable State Logic
**Goal**: Encapsulate stateful behavior so pages remain presentational and logic is reusable.
**Risk**: medium (must verify hook behavior matches original page logic)

### Steps
- [x] Step 3.1: Create `useDonationForm` hook to encapsulate Donations page state
  - What: Create `src/hooks/useDonationForm.ts` with:
    - All useState calls from Donations.tsx (amount, customAmount, frequency, cause, paymentMethod, step, form, paymentResult, bankAccount, isSubmitting, apiError, copied)
    - handleSubmit function (lines 45-128)
    - Helper functions: handleCopy, getMailLink
  - Why: The Donations page has 11 separate useState calls (lines 15-28). Moving these to a hook makes the page purely presentational and the form logic reusable.
  - Imports to update:
    - `src/app/pages/Donations.tsx`: Replace all useState and handlers with single hook import `useDonationForm`
  - Verify: `grep -r "useState.*amount" src/app/pages/Donations.tsx` should return zero results

- [x] Step 3.2: Create `useAdminDashboard` hook to encapsulate AdminDashboard state
  - What: Create `src/hooks/useAdminDashboard.ts` with:
    - useState calls: overview, loading, error, activeTab (lines 8-11)
    - useEffect with fetchOverview logic (lines 13-33)
  - Why: AdminDashboard has 4 useState calls mixed with a useEffect that fetches data. Extracting to a hook lets the page focus on rendering.
  - Imports to update:
    - `src/app/pages/AdminDashboard.tsx`: Replace useState and useEffect with `const { overview, loading, error, activeTab, setActiveTab } = useAdminDashboard()`
  - Verify: `grep -r "useState" src/app/pages/AdminDashboard.tsx` should return zero results (except for any local UI state like modals)

## Phase 4: Update All Imports and Verify
**Goal**: Ensure all pages and components reference the new services and hooks correctly.
**Risk**: low (primarily import path updates)

### Steps
- [x] Step 4.1: Update Donations.tsx imports
  - What: Update `src/app/pages/Donations.tsx`:
    - Remove direct fetch calls (already moved in Phase 2)
    - Import `useDonationForm` hook
    - Remove axios import if present
  - Why: After Phases 2-3, the page should import the hook and service rather than defining inline logic
  - Imports to update: Already handled in Phases 2-3

- [x] Step 4.2: Update AdminDashboard.tsx imports
  - What: Update `src/app/pages/AdminDashboard.tsx`:
    - Remove axios import
    - Import `useAdminDashboard` hook instead of inline useState/useEffect
  - Why: After Phases 2-3, the page should use the custom hook
  - Imports to update: Already handled in Phases 2-3

- [x] Step 4.3: Verify no orphaned API calls remain
  - What: Run `grep -r "fetch.*api/" src/app/pages/` and `grep -r "axios\." src/app/pages/` to ensure all API calls moved
  - Why: Any inline API calls left in pages violate the architecture and indicate incomplete refactoring

## Phase 5: Extract Reusable Components
**Goal**: Break down large monolithic components and move shareable pieces to `src/components/`.
**Risk**: medium (Layout is critical; must test nav, mobile menu, footer)

### Steps
- [x] Step 5.1: Break down Layout component (307 LOC)
  - What: Create new presentational components in `src/components/`:
    - `Header.tsx` - Top bar with contact info and social links (Layout.tsx lines 51-92)
    - `Navigation.tsx` - Main navbar with logo and nav links (Layout.tsx lines 94-148)
    - `Footer.tsx` - Footer section (Layout.tsx lines 185-322)
    - Update `src/app/components/Layout.tsx` to import these and compose them
  - Why: Layout mixes header, nav, mobile menu, footer in 325 lines. Breaking into smaller components makes each easier to test and modify independently.
  - Imports to update:
    - `src/app/components/Layout.tsx`: import Header, Navigation, Footer from `src/components/`
  - Verify: `src/app/components/Layout.tsx` should be < 150 LOC after this step

- [x] Step 5.2: Extract Header sub-components
  - What: Create in `src/components/header/`:
    - `TopBar.tsx` - Contact info bar (current Layout.tsx lines 52-92)
    - `MainNav.tsx` - Navigation bar with desktop and mobile menus (current Layout.tsx lines 95-177)
  - Why: Separating TopBar and MainNav into files makes them independently testable and reusable
  - Imports to update:
    - `src/components/Header.tsx`: import TopBar, MainNav and compose

- [x] Step 5.3: Move hardcoded nav links to a constant
  - What: Extract `navLinks` array (Layout.tsx line 24-30) to `src/config/navigation.ts`
  - Why: navLinks is defined in Layout but also needed in Footer. Sharing through a config file prevents duplication and makes it a single source of truth.
  - Imports to update:
    - `src/app/components/Layout.tsx`: import navLinks from `src/config/navigation.ts`
    - `src/components/Footer.tsx`: import navLinks from `src/config/navigation.ts`
  - Verify: `grep -r "navLinks" src/` should reference only `src/config/navigation.ts` as source

## Phase 6: Resolve Routing Duplication ✅ COMPLETE
**Goal**: Remove `src/AppRoutes.tsx` (older router setup) and consolidate to `src/app/routes.ts`.
**Risk**: medium (routing is critical; must test all routes still work)

### Steps
- [x] Step 6.1: Verify `src/app/routes.ts` has all routes from `src/AppRoutes.tsx`
  - Compared both files and identified missing payment confirmation and admin routes

- [x] Step 6.2: Add missing routes to `src/app/routes.ts`
  - Added: BankTransferConfirmation, MobileMoneyConfirmation, CardPaymentConfirmation, AdminDashboard
  
- [x] Step 6.3: Delete `src/AppRoutes.tsx`
  - Confirmed `src/app/App.tsx` uses `src/app/routes.ts`
  - Safely deleted the obsolete router file

## Phase 8: Refactor Axios to Fetch-based Services ✅ COMPLETE
**Goal**: Replace direct axios calls in payment pages with fetch-based services layer.
**Risk**: medium (payment pages are critical functionality)

### Steps
- [x] Step 8.1: Create `src/services/payments.ts` with fetch-based API functions
  - Functions: getPaymentConfirmation, getMobileMoneyProviders, submitMobileMoneyPayment, submitCardPayment
  - Uses fetch API (built-in, no dependencies needed)
  - Proper error handling with meaningful messages

- [x] Step 8.2: Create custom hooks for payment pages
  - `usePaymentConfirmation.ts` - For BankTransferConfirmation
  - `useMobileMoneyConfirmation.ts` - For MobileMoneyConfirmation (includes form state)
  - `useCardPaymentConfirmation.ts` - For CardPaymentConfirmation (includes form state)

- [x] Step 8.3: Refactor payment confirmation pages
  - Updated: BankTransferConfirmation.tsx, MobileMoneyConfirmation.tsx, CardPaymentConfirmation.tsx
  - Removed: All direct axios calls and import statements
  - Result: Cleaner pages that use hooks instead of inline API logic

- [x] Step 8.4: Verify no axios imports remain
  - Confirmed: `grep -r "import.*axios" src/` returns no results
  - **Benefit**: Eliminated axios dependency - app now uses only built-in fetch API

---

---

## Estimated Impact
- **Total Phases**: 7
- **Total Steps**: ~22 actionable changes
- **Biggest Risk**: Phase 5 (breaking down Layout) and Phase 6 (routing consolidation) — these touch critical paths
- **Biggest Win**: Phase 1-2 — centralizing API calls removes duplicate configuration and makes auth headers consistent across the app
- **Time Estimate**: 2-3 hours for experienced developer familiar with the routes

## Why This Order
1. **Phase 1**: Foundation first — services and hooks must exist before pages can import them
2. **Phase 2**: Move API calls before extracting hooks — easier to extract clean functions after inline calls are centralized
3. **Phase 3**: Extract hooks after services exist — hooks can now delegate to services instead of containing fetch logic
4. **Phase 4**: Verify imports work — ensures refactoring is correct before touching large components
5. **Phase 5**: Break down UI last — safer to do after data/state is already separated
6. **Phase 6**: Fix routing once pages are stable — routing changes don't affect data flow
7. **Phase 7**: Cleanup last — only delete once you're confident nothing else needs the code

## Architecture After Refactoring
```
src/
├── main.tsx                      # Entry point
├── AppRoutes.tsx                 # (DELETE in Phase 6)
├── app/
│   ├── routes.ts                 # Router definition (consolidated)
│   ├── App.tsx                   # Layout wrapper
│   ├── components/
│   │   ├── Layout.tsx            # Simplified, uses sub-components
│   │   └── ui/                   # shadcn UI components (unmodified)
│   └── pages/                    # Presentational pages, import hooks not useState
├── components/                   # (NEW) Reusable presentational components
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── header/                   # Sub-components
│       ├── TopBar.tsx
│       └── MainNav.tsx
├── hooks/                        # (NEW) Custom hooks encapsulating state/side effects
│   ├── useDonationForm.ts
│   ├── useAdminDashboard.ts
│   └── useFetch.ts
├── services/                     # (NEW) Centralized API calls
│   ├── api.ts                    # Base client with config
│   ├── donations.ts
│   └── admin.ts
├── config/                       # (NEW) Centralized configuration
│   ├── api.ts                    # API_URL
│   └── navigation.ts             # Shared nav links
├── assets/                       # Unmodified
└── styles/                       # Unmodified
```

Data flow after refactoring:
```
Page → Hook → Service → API
         ↓
      useState + useEffect
```

Components are purely presentational; all data fetching and state is in hooks.
