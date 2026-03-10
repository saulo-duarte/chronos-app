---
trigger: always_on
---

# Form Rules

All forms must use:

React Hook Form + Zod

## Schema Validation

All forms must use schema validation.

Example:

const schema = z.object({
email: z.string().email(),
password: z.string().min(8)
})

Avoid manual validation.

---

## DTO Alignment

Form types must align with backend DTOs.

Never duplicate DTO definitions.

Always import types from shared backend packages when possible.

---

## Error Display

Form validation errors must be visible.

Preferred approaches:

- inline error messages
- input error states
