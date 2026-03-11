---
name: feature-module-structure
description: Defines the standardized directory structure for feature-based modules in Next.js projects. Covers file naming, responsibility boundaries, and how to structure api, components, hooks, schemas, and types per feature.
---

# Feature Module Structure

## Core Principle

Organize code by **feature (domain)**, not by type. Every feature is a self-contained module.

---

## Top-Level App Structure

```
app/                # Next.js App Router pages only
  (dashboard)/
    page.tsx
  (auth)/
    login/
      page.tsx

features/           # All business logic lives here
  users/
  tasks/
  collections/

components/         # Shared, reusable UI components
  ui/               # Shadcn re-exports / overrides
  domain/           # Shared domain components
    users/
    tasks/

hooks/              # Shared/global hooks
lib/                # Shared utilities and config
schemas/            # Shared/global schemas (rare)
types/              # Global TypeScript types
stores/             # Zustand stores
services/           # (Optional) Global API client setup
```

---

## Feature Module Structure

Each feature follows this internal structure:

```
features/
  users/
    api/                # API calls for this feature
      getUsers.ts
      getUserById.ts
      createUser.ts
      updateUser.ts
      deleteUser.ts
    components/         # Feature-specific UI components
      UserTable.tsx
      UserForm.tsx
      UserCard.tsx
      columns.ts        # TanStack Table column definitions
    hooks/              # React Query hooks for this feature
      useUsersQuery.ts
      useUserQuery.ts
      useCreateUserMutation.ts
      useUpdateUserMutation.ts
    schemas/            # Zod schemas for this feature
      createUser.schema.ts
      updateUser.schema.ts
    types/              # Local type definitions (if no shared DTO)
      user.types.ts
```

---

## File Responsibilities

| File/Folder   | Responsibility                                                         |
| ------------- | ---------------------------------------------------------------------- |
| `api/`        | HTTP calls only. Maps DTOs. Returns typed responses. Never renders UI. |
| `components/` | Renders UI. Calls hooks. Must be under 200 lines.                      |
| `hooks/`      | Wraps React Query. Provides typed data to components.                  |
| `schemas/`    | Zod schemas. Derived from DTOs. Used by forms and APIs.                |
| `types/`      | Local types. Use only if no shared DTO exists.                         |

---

## Naming Conventions

| Pattern            | Example                                         |
| ------------------ | ----------------------------------------------- |
| Query hooks        | `useXxxQuery`, `useXxxsQuery`                   |
| Mutation hooks     | `useCreateXxxMutation`, `useUpdateXxxMutation`  |
| API functions      | `getXxx`, `createXxx`, `updateXxx`, `deleteXxx` |
| Schemas            | `createXxx.schema.ts`, `updateXxx.schema.ts`    |
| Components         | `XxxForm.tsx`, `XxxTable.tsx`, `XxxCard.tsx`    |
| Column definitions | `columns.ts` (inside `components/`)             |

---

## App Router Pages

Pages in `app/` are thin. They should:

- Import feature components
- Pass minimal props (e.g., search params, route params)
- Never contain business logic

```tsx
// app/(dashboard)/users/page.tsx
import { UsersView } from "@/features/users/components/UsersView";

export default function UsersPage() {
  return <UsersView />;
}
```

---

## Cross-Feature Communication

- Features **must not** import internal files from each other directly.
- Communication happens via:
  - Shared `types/` or `packages/api-types`
  - Shared `hooks/` at root level
  - Zustand stores in `stores/`

```ts
// ❌ Bad — cross-feature internal import
import { userQueryKeys } from "@/features/users/hooks/useUsersQuery";

// ✅ Good — shared query key factory
import { queryKeys } from "@/lib/queryKeys";
```

---

## Component Size Enforcement

If a component exceeds ~200 lines:

1. Extract data logic into a hook (`useXxxLogic.ts`)
2. Extract sub-sections into smaller components (`XxxHeader.tsx`, `XxxFilters.tsx`)
3. Keep the parent as a composition shell

```tsx
// ✅ Good decomposition
export function UsersView() {
  return (
    <div>
      <UsersHeader />
      <UsersFilters />
      <UsersTable />
    </div>
  );
}
```
