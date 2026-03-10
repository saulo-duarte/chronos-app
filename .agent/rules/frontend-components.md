---
trigger: always_on
---

# Component Architecture Rules

Components must remain small, composable, and reusable.

## Component Size

Avoid large components.

Rules:

- Prefer components under 200 lines
- Split logic into hooks when needed
- Split UI into smaller subcomponents

Bad example:

DashboardPage handling:

- data fetching
- rendering
- forms
- modals
- filters
- tables

Good example:

DashboardPage
├ DashboardHeader
├ DashboardFilters
├ DashboardTable
└ DashboardStats

---

## Composition Over Prop Drilling

Avoid prop drilling.

Prefer:

- component composition
- React Query
- Zustand

Bad:

Parent → Child → Child → Child props

Good:

Use shared state or queries.

---

## Reusability

Before creating new utilities or components:

Check if a similar utility already exists.

Examples:

Formatting
Date helpers
Currency helpers
Validation helpers

Reusable utilities should live in:

lib/
utils/

---

## Shared Components

Reusable UI components should live in:

components/

Reusable domain components should live in:

components/domain/

Example:

components/
components/domain/users/
components/domain/payments/
