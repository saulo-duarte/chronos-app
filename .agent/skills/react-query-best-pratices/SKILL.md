---
name: react-query-best-practices
description: Best practices for using TanStack Query for server state management.
---

# React Query Best Practices

This skill defines how server state must be handled.

Use this skill when:

- implementing API calls
- reviewing data fetching logic
- implementing mutations
- managing caching
- optimizing frontend performance

---

# General Principles

React Query must be the single source of truth for server state.

Never duplicate server data in:

- Zustand
- local React state

React Query cache should manage server data.

---

# Query Keys

Query keys must be stable and predictable.

Use a query key factory.

Example:

queryKeys.users.list
queryKeys.users.detail(userId)

Avoid inline query keys.

Bad:

useQuery(["users", id])

Good:

useQuery(queryKeys.users.detail(id))

---

# Query Structure

Queries must follow this structure:

- query key
- query function
- options

Example:

useQuery({
queryKey: queryKeys.users.list,
queryFn: getUsers
})

Avoid anonymous query functions inside components.

Prefer reusable service functions.

---

# Services Layer

API calls should live in a service layer.

Example directory:

services/
users/
getUsers.ts
createUser.ts
updateUser.ts

Components should never directly call fetch.

---

# Mutations

Mutations must use React Query.

Example:

useMutation({
mutationFn: createUser
})

After mutation success:

Invalidate related queries.

Example:

queryClient.invalidateQueries(queryKeys.users.list)

---

# Optimistic Updates

Use optimistic updates when appropriate.

Example cases:

- toggling favorites
- updating small fields
- deleting items

Avoid optimistic updates for complex workflows.

---

# Caching Strategy

Use caching intentionally.

Examples of good caching:

- lists
- configuration
- lookup tables

Avoid aggressive refetching.

Configure staleTime where appropriate.

---

# Error Handling

All queries must handle errors.

Options:

- retry
- error states
- toast notifications

Example pattern:

if (error) {
toast.error("Failed to load users")
}

---

# Loading States

Prefer component-level loading states.

Examples:

- skeleton loaders
- inline spinners

Avoid blocking the entire page.

---

# Prefetching

Prefetch data when navigation is predictable.

Example:

prefetch next page data.

Example scenario:

Hovering a link.

---

# Pagination

Use React Query patterns for pagination.

Avoid manual pagination logic.

Prefer:

- cursor pagination
- infinite queries

Example:

useInfiniteQuery()

---

# Performance Guidelines

Avoid:

- refetching the same data repeatedly
- multiple queries for the same resource

Prefer:

- shared query keys
- cache reuse

---

# Debugging

Use React Query Devtools during development.

This helps inspect:

- cache
- query states
- refetch behavior

---

# Anti-patterns

Avoid:

useEffect for fetching.

Avoid:

duplicating server data in Zustand.

Avoid:

manual caching.

React Query must be responsible for server state.
