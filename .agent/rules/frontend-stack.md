---
trigger: always_on
---

# Frontend Stack Standards

This project uses a strict frontend stack. Agents must follow these rules when generating or modifying code.

## Framework

Use Next.js App Router architecture.

Prefer server components whenever possible.

Client components should only be used when necessary:

- interactive UI
- browser APIs
- stateful logic
- animations
- form handling

Do not add "use client" unnecessarily.

---

## Component Library

Always prefer components from shadcn/ui.

Do not recreate components that already exist in shadcn.

Examples:

Good:

- Button
- Dialog
- Sheet
- Tooltip
- DropdownMenu
- Tabs
- Popover

Bad:

- Creating custom button variants
- Recreating modal logic
- Reimplementing dropdowns

Only create custom components when the design cannot be implemented with shadcn primitives.

---

## Animations

Use Framer Motion for animations.

Rules:

- Animations must be subtle
- Avoid slow animations
- Avoid blocking interactions
- Animation duration should normally be between 150ms and 300ms

Never introduce complex animation timelines unless strictly required.

---

## Forms

Forms must use:

React Hook Form + Zod

Never implement manual form validation.

Validation must always be schema-driven.

---

## State Management

Use the following hierarchy:

Server state:

- React Query

Client shared state:

- Zustand

Local state:

- React useState

Avoid mixing these responsibilities.
