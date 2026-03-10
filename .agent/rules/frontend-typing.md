---
trigger: always_on
---

# TypeScript Rules

Type safety is mandatory.

## Avoid any

Never use the any type.

If necessary use:

unknown

But prefer proper types.

---

## DTO Alignment

Frontend types must match backend DTOs.

In a monorepo:

Import DTO types from shared backend packages.

Do not duplicate types locally.

---

## Enums and Constants

Avoid magic strings.

Prefer enums or constants.

Bad:

status === "active"

Good:

status === UserStatus.ACTIVE
