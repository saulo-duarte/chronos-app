---
name: frontend-review
description: Guidelines for reviewing frontend code in this project. Focus on architecture, React patterns, performance, and UX.
---

# Frontend Code Review Skill

This skill defines how frontend code should be reviewed in this project.

Use this skill when:

- reviewing pull requests
- generating new components
- refactoring UI code
- analyzing performance problems
- validating adherence to project rules

The goal is to ensure consistency, maintainability, and good UX.

---

# Review Strategy

When reviewing code, analyze the following areas:

1. Component architecture
2. State management
3. Data fetching
4. Type safety
5. UX feedback
6. Performance
7. Accessibility
8. Code duplication

Each section below describes what to validate.

---

# Component Architecture

Components must remain small and composable.

Check for:

- components larger than 200 lines
- multiple responsibilities inside one component
- business logic inside UI components

Bad example:

A page component that:

- fetches data
- handles filters
- renders table
- manages modals
- manages forms

Good example:

Split responsibilities:

Page
├ Filters
├ Table
├ Modal
└ Form

---

# State Management

Ensure correct usage of state tools.

Server state:
Use React Query.

Client shared state:
Use Zustand.

Local UI state:
Use useState.

Check for anti-patterns:

Bad:

Duplicating server data inside Zustand.

Bad:

Fetching API data using useEffect.

Good:

Using React Query for all remote data.

---

# Data Fetching

Verify that data fetching follows project patterns.

Check:

- usage of React Query
- stable query keys
- correct cache invalidation

Bad example:

useEffect + fetch for API calls.

Good example:

useQuery with query key factory.

---

# Type Safety

Type safety is mandatory.

Check for:

- usage of any
- duplicated DTO definitions
- missing type annotations

Bad:

const user: any

Good:

const user: UserDTO

Always prefer shared backend types.

---

# UX Feedback

Users must receive feedback for actions.

Check for:

- missing loading states
- missing success feedback
- missing error feedback

Rules:

Never block the entire page with loading.

Prefer:

- skeleton loaders
- component loaders

For actions:

Use toast notifications.

---

# Performance

Analyze performance issues.

Check for:

- unnecessary re-renders
- large components
- expensive computations inside render

Bad:

Heavy calculations inside JSX.

Good:

useMemo for derived data.

Also check:

- large lists without pagination
- large lists without virtualization

---

# Accessibility

Ensure basic accessibility.

Check:

- form labels
- button semantics
- keyboard navigation

Prefer semantic HTML.

---

# Code Reuse

Check for duplicated utilities.

Examples:

- date formatting
- currency formatting
- string formatting

Reusable helpers should live in:

utils/
lib/

---

# Animation Review

Animations must follow project guidelines.

Check for:

- long animations
- animations blocking interaction

Use subtle animations only.

Preferred animation duration:

150ms - 300ms.

Use Framer Motion.

---

# Final Review Output

When reporting results, categorize findings:

Critical
Major
Minor
Suggestion

Example:

Critical

- API call inside useEffect

Major

- component with 400 lines

Minor

- duplicated helper function

Suggestion

- split component into smaller pieces
