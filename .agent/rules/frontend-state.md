---
trigger: always_on
---

# State Management Rules

Use the correct tool depending on the state type.

## Server State

All API data must use React Query.

Never fetch API data using:

- useEffect
- manual fetch
- axios inside components

Always use React Query.

Example:

useQuery
useMutation

---

## Client Shared State

Use Zustand for shared client state.

Examples:

- filters
- UI preferences
- selected items
- multi-step form state

Do not store server data inside Zustand.

---

## Local State

Use React useState for local UI state.

Examples:

- modal open
- toggle state
- input temporary values

---

## Derived State

Avoid unnecessary state.

Prefer computing values instead of storing them.

Example:

Bad:

store filteredItems in state

Good:

compute filteredItems from items
