---
name: react-query-standard
description: Standardized patterns for using TanStack Query (React Query). Covers query key factories, hook patterns per feature, mutation strategies, caching, error handling, and optimistic updates.
---

# React Query Standards

## Core Usage Rules

- **All API data must go through React Query.** No raw `fetch`, `axios`, or `useEffect` for data fetching.
- Use React Query for: fetching, caching, background updates, mutations, and invalidation.
- Server Components should fetch data directly (on the server). Use React Query on the **client side** only.

---

## Query Key Factory

Define all query keys in a central factory to ensure stability and prevent typos.

```ts
// lib/queryKeys.ts
export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (filters?: UsersFilter) => ["users", "list", filters] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: TasksFilter) => ["tasks", "list", filters] as const,
    detail: (id: string) => ["tasks", "detail", id] as const,
  },
};
```

### Rules

```ts
// ✅ Good
useQuery({ queryKey: queryKeys.users.detail(id) });

// ❌ Bad — inline, unstable, no type safety
useQuery({ queryKey: ["users", id] });
```

---

## Hook Patterns Per Feature

Each feature defines its own set of hooks in `features/xxx/hooks/`.

### Query Hook

```ts
// features/users/hooks/useUsersQuery.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getUsers } from "../api/getUsers";
import type { UsersFilter } from "../types/user.types";

export function useUsersQuery(filters?: UsersFilter) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes for list data
  });
}
```

### Detail Query Hook

```ts
// features/users/hooks/useUserQuery.ts
export function useUserQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
}
```

---

## Mutation Patterns

### Standard Mutation

```ts
// features/users/hooks/useCreateUserMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { createUser } from "../api/createUser";
import { toast } from "sonner";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create user");
      console.error("Create user error:", error);
    },
  });
}
```

### Optimistic Update Mutation

```ts
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
      const previous = queryClient.getQueryData(
        queryKeys.users.detail(variables.id),
      );
      queryClient.setQueryData(queryKeys.users.detail(variables.id), (old) => ({
        ...old,
        ...variables,
      }));
      return { previous };
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        queryKeys.users.detail(variables.id),
        context?.previous,
      );
      toast.error("Failed to update user");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
}
```

---

## Caching Strategy

| Data Type                          | `staleTime`             |
| ---------------------------------- | ----------------------- |
| Reference data (roles, categories) | `Infinity` or very long |
| List data                          | 5 minutes               |
| Detail data                        | 3–5 minutes             |
| Frequently changing data           | 30–60 seconds           |

```ts
// Stable reference data
useQuery({
  queryKey: queryKeys.roles.all,
  queryFn: getRoles,
  staleTime: Infinity,
});
```

---

## Prefetching (Server → Client Hydration)

```ts
// app/(dashboard)/users/page.tsx (Server Component)
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { getUsers } from "@/features/users/api/getUsers"

export default async function UsersPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.list(),
    queryFn: getUsers,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersView />
    </HydrationBoundary>
  )
}
```

---

## Error & Loading State Handling

```tsx
export function UsersTable() {
  const { data, isLoading, isError } = useUsersQuery();

  if (isLoading) return <UsersTableSkeleton />;
  if (isError) return <ErrorMessage message="Failed to load users" />;

  return <DataTable columns={columns} data={data} />;
}
```

- Never block the full page. Use component-level loading states.
- Always handle `isError` with a visible error state, not just a console log.
