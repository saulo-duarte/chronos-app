---
name: form-schema-best-practices
description: Standards for form implementation using React Hook Form and Zod. Covers schema-driven validation, DTO alignment, error display, and integration with React Query mutations.
---

# Form & Schema Best Practices

## Core Principle

All forms are **schema-driven**. Validation is **never** done manually. Every form field, type, and validation rule is defined in a Zod schema, derived from a backend DTO.

---

## The Complete Form Flow

```
Backend DTO
  ↓
Zod Schema (satisfies ZodType<DTO>)
  ↓
z.infer<typeof schema> → Form Type
  ↓
React Hook Form (zodResolver)
  ↓
Submit → API mutation (React Query)
```

---

## Defining the Schema

```ts
// features/users/schemas/createUser.schema.ts
import { z } from "zod";
import type { CreateUserDTO } from "@repo/api-types/user.dto";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  role: z.nativeEnum(UserRole, { required_error: "Role is required" }),
  age: z.number().int().min(18, "Must be at least 18").optional(),
}) satisfies z.ZodType<CreateUserDTO>;

export type CreateUserFormData = z.infer<typeof createUserSchema>;
```

> **Rule:** The `satisfies z.ZodType<DTO>` constraint enforces alignment with the backend. If the DTO changes, TypeScript will flag all broken schemas immediately.

---

## Hook: `useForm` Setup

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/createUser.schema";

const form = useForm<CreateUserFormData>({
  resolver: zodResolver(createUserSchema),
  defaultValues: {
    name: "",
    email: "",
    role: UserRole.MEMBER,
  },
});
```

---

## Complete Form Component

```tsx
// features/users/components/CreateUserForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/createUser.schema";
import { useCreateUserMutation } from "../hooks/useCreateUserMutation";

export function CreateUserForm() {
  const mutation = useCreateUserMutation();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "" },
  });

  function onSubmit(data: CreateUserFormData) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage /> {/* Renders Zod error messages automatically */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Edit Forms (Pre-populated)

For edit forms, use the same schema but with existing data as `defaultValues`:

```ts
const form = useForm<UpdateUserFormData>({
  resolver: zodResolver(updateUserSchema),
  defaultValues: {
    name: user.name,
    email: user.email,
  },
});

// Reset when data loads (for async defaultValues)
useEffect(() => {
  if (user) form.reset({ name: user.name, email: user.email });
}, [user]);
```

> This is one of the **few valid uses** of `useEffect`.

---

## Rules

| Rule                  | Detail                                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| No manual validation  | All validation via Zod schemas                                                     |
| No `any` on form data | Types come from `z.infer<typeof schema>`                                           |
| DTO alignment         | Use `satisfies z.ZodType<DTO>` on every form schema                                |
| Shadcn Form           | Always use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` from Shadcn |
| Error display         | Always include `<FormMessage />` under each field                                  |
| Loading state         | Disable submit button while `mutation.isPending`                                   |
| Toast feedback        | `toast.success` / `toast.error` in mutation hook, not in the form component        |

---

## Anti-Patterns

```tsx
// ❌ Manual validation
if (!email.includes("@")) {
  setError("Invalid email");
}

// ❌ Type as any
const values = form.getValues() as any;

// ❌ Fetch inside onSubmit
async function onSubmit(data) {
  await fetch("/api/users", { method: "POST", body: JSON.stringify(data) });
}
// ✅ Use mutation.mutate(data) instead
```
