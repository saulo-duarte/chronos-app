---
name: monorepo-dto-alignment
description: Guidelines for maintaining type safety between backend DTOs and the frontend in a monorepo. Covers the DTO-to-schema-to-form flow and ensures zero type duplication.
---

# Monorepo DTO Alignment

## Core Principle

The backend DTO is the **single source of truth**. Frontend types must be derived from it, never manually redefined.

### The Flow

```
Backend DTO (packages/api-types)
  ↓
TypeScript type (inferred from Zod)
  ↓
Zod Schema (validated)
  ↓
React Hook Form schema
  ↓
API Client call
  ↓
React Query (typed response)
```

---

## Monorepo Structure

```
apps/
  web/           # Next.js frontend

packages/
  api-types/     # Shared DTOs (source of truth)
  ui/            # Shared UI components
  config/        # Shared configs (eslint, ts, etc.)
  utils/         # Shared utility functions
```

### `packages/api-types` Example

```ts
// packages/api-types/user.dto.ts
export type CreateUserDTO = {
  name: string;
  email: string;
  role: UserRole;
};

export type UserDTO = CreateUserDTO & {
  id: string;
  createdAt: string;
};
```

---

## Frontend Usage Pattern

### Step 1: Import the DTO

```ts
import type { CreateUserDTO } from "@repo/api-types/user.dto";
```

### Step 2: Build the Zod Schema from the DTO shape

```ts
// features/users/schemas/createUser.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(UserRole),
}) satisfies z.ZodType<CreateUserDTO>;
```

> The `satisfies z.ZodType<CreateUserDTO>` constraint guarantees the schema stays aligned with the DTO.

### Step 3: Infer the Form Type

```ts
export type CreateUserFormData = z.infer<typeof createUserSchema>;
```

### Step 4: Use in React Hook Form

```ts
const form = useForm<CreateUserFormData>({
  resolver: zodResolver(createUserSchema),
});
```

### Step 5: API Client maps form data to DTO

```ts
// features/users/api/createUser.ts
export async function createUser(data: CreateUserFormData): Promise<UserDTO> {
  const response = await apiClient.post<UserDTO>("/users", data);
  return response.data;
}
```

---

## Rules

- **Never** write `type User = { id: string; name: string }` if a DTO exists.
- **Never** duplicate enums — import them from `packages/api-types`.
- The `satisfies` keyword must be used on schemas to enforce DTO alignment.
- Form types come from `z.infer<typeof schema>`, not from the DTO directly.
- If the backend DTO changes, only the schema needs to be updated — TypeScript will surface all breaking changes automatically.

---

## Anti-Patterns to Avoid

```ts
// ❌ Manual type duplication
type CreateUserForm = {
  name: string;
  email: string;
};

// ❌ Zod schema not aligned with DTO
const schema = z.object({ username: z.string() }); // "username" doesn't exist in DTO

// ❌ Casting to any to match DTO
const payload = formData as any;
```
