---
trigger: always_on
---

# Data Fetching Rules

All API requests must use React Query.

## Query Structure

Use stable query keys.

Use a query key factory.

Example:

queryKeys.users.list
queryKeys.users.detail(id)

Avoid inline query keys.

Bad:

useQuery(["users", id])

Good:

useQuery(queryKeys.users.detail(id))

---

## Caching

Use caching when possible.

Prefer longer stale times for stable data.

Examples:

- lists
- configuration data
- reference tables

---

## Mutations

Use React Query mutations.

After mutations:

- invalidate related queries
- update cache when appropriate

Example:

queryClient.invalidateQueries(queryKeys.users.list)

---

## Error Handling

All queries must handle error states.

Error handling patterns:

- toast notifications
- inline errors
- retry options
