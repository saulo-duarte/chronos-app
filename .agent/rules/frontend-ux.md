---
trigger: always_on
---

# UX and Feedback Rules

User feedback is mandatory for important interactions.

## Loading States

Never block the entire page with loading indicators.

Use component-level loading states.

Preferred options:

- skeleton components
- small loaders

Example:

Skeleton
Loader2

---

## Feedback

Always provide feedback for:

- successful actions
- failed actions
- important state changes

Use toast notifications.

Example:

toast.success("User created")
toast.error("Failed to update")

---

## Responsiveness

Layouts must work across common breakpoints.

Avoid layouts that break on smaller screens.

Prefer flexible layouts using Tailwind utilities.
