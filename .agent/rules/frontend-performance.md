---
trigger: always_on
---

# Performance Rules

Performance should be considered when building components.

## Rendering

Avoid unnecessary re-renders.

Use memoization when necessary.

Examples:

React.memo
useMemo
useCallback

Do not overuse memoization.

---

## Bundle Size

Avoid importing heavy libraries unnecessarily.

Prefer modular imports.

---

## Next.js Optimization

Prefer server components when possible.

Use dynamic imports when loading large UI modules.

Example:

dynamic(() => import("./HeavyComponent"))

---

## Lists

For large lists:

Prefer virtualization.

Avoid rendering large lists without pagination or virtualization.
