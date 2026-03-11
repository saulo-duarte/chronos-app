---
name: frontend-architecture-standards
description: Core architectural standards for Next.js frontend projects. Defines the tech stack, mandatory rules, checklist, and quality gates for all frontend code.
---

# Frontend Architecture Standards

## Stack Overview

| Layer         | Library                      |
| ------------- | ---------------------------- |
| Framework     | Next.js (App Router)         |
| Language      | TypeScript (strict)          |
| UI Components | Shadcn UI                    |
| Server State  | TanStack Query (React Query) |
| Forms         | React Hook Form + Zod        |
| Tables        | TanStack Table               |
| Animations    | Framer Motion                |

---

## Mandatory Rules

### TypeScript

- `strict: true` in `tsconfig.json` is non-negotiable.
- **Never** use `any`. Use `unknown` only if truly necessary.
- **Always** infer types from Zod schemas:

  ```ts
  // ✅ Good
  type User = z.infer<typeof userSchema>;

  // ❌ Bad — duplicates DTO
  type User = { id: string; name: string };
  ```

### Component Design

- **Server Components by default.** Add `"use client"` only when required.
- Use `"use client"` only for: forms, event handlers, browser APIs, animations, local state.
- **Never** use `"use client"` for initial data fetching or static rendering.
- Keep components under **200 lines**. Split into subcomponents or hooks when exceeding this limit.
- **Single Responsibility**: one component, one purpose.

### State Management

| State Type            | Tool        |
| --------------------- | ----------- |
| Server/API data       | React Query |
| Shared client state   | Zustand     |
| Local/transient state | `useState`  |

- **Never** store server data in Zustand.
- **Prefer derived/computed state** over storing calculated values.

### UI Components

- **Always** use Shadcn UI primitives. Never rewrite what already exists (`Button`, `Dialog`, `Input`, `Table`, `Form`, etc.).
- Extend Shadcn with `cn()` (uses `clsx` + `tailwind-merge`). Never override styles with `!important`.
- Animations: use Framer Motion. Duration: **150ms–300ms**. Keep them subtle.

### Loading & Feedback

- **Never** leave the UI empty during loading. Always provide skeletons or spinners.
- **Always** provide toast feedback on `mutation` success and error.
  ```ts
  toast.success("User created");
  toast.error("Failed to update");
  ```

### Effects

- **Avoid `useEffect`** whenever possible. Prefer:
  1. Server Components for initial data
  2. React Query for client-side fetching
  3. Derived/computed state for transformations
  4. Event handlers for side effects

---

## Pre-Commit Checklist

Before considering any feature complete, verify:

- [ ] No `any` types
- [ ] Types inferred from schemas, not manually written
- [ ] Schema validation present on all forms
- [ ] React Query used for all API calls (no raw `fetch` in components)
- [ ] Server Components preferred; `"use client"` justified
- [ ] No unnecessary `useEffect`
- [ ] Skeletons/loading states present in all data-driven UI
- [ ] Toast feedback on all mutations
- [ ] Lint passes: `eslint`
- [ ] Type check passes: `tsc --noEmit`
