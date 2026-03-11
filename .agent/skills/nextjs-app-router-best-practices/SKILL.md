---
name: nextjs-app-router-best-practices
description: Best practices for Next.js App Router. Covers server vs client component decision tree, data fetching strategies with React Query hydration, routing patterns, metadata, and performance optimization.
---

# Next.js App Router Best Practices

## Server vs Client Components

### Decision Tree

```
Does this component need:
  - onClick, onChange, onSubmit, or event handlers? → "use client"
  - useState or useReducer? → "use client"
  - useEffect? → "use client" (but reconsider if avoidable)
  - browser APIs (window, document, localStorage)? → "use client"
  - Framer Motion animations? → "use client"
  - React Query useQuery/useMutation hooks? → "use client"
  - Third-party client-only libraries? → "use client"

If none of the above → Server Component (no directive needed)
```

### Server Components — Do

```tsx
// ✅ Server Component: fetches data, no interactivity needed
// app/(dashboard)/users/page.tsx

import { db } from "@/lib/db";
import { UsersView } from "@/features/users/components/UsersView";

export default async function UsersPage() {
  const users = await db.users.findMany();
  return <UsersView initialData={users} />;
}
```

### Client Components — Do

```tsx
// ✅ Only add "use client" where interactivity or hooks are needed
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ToggleButton() {
  const [active, setActive] = useState(false);
  return (
    <Button onClick={() => setActive(!active)}>{active ? "On" : "Off"}</Button>
  );
}
```

---

## Data Fetching Strategy

### Recommended Pattern: Prefetch + Hydration

Server Component fetches data and hydrates the React Query cache. The client component then reads from the cache immediately — no loading flash.

```tsx
// app/(dashboard)/users/page.tsx (Server Component)
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getUsers } from "@/features/users/api/getUsers";
import { UsersView } from "@/features/users/components/UsersView";

export default async function UsersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.list(),
    queryFn: getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersView />
    </HydrationBoundary>
  );
}
```

```tsx
// features/users/components/UsersView.tsx (Client Component)
"use client";
import { useUsersQuery } from "../hooks/useUsersQuery";

export function UsersView() {
  const { data, isLoading } = useUsersQuery(); // Cache is already populated!
  if (isLoading) return <UsersTableSkeleton />;
  return <UsersTable data={data} />;
}
```

---

## Routing

### `app/` directory is for routing only

Pages must be thin. Import feature components, don't write business logic in pages.

```tsx
// ✅ Good
export default function UserDetailPage({ params }) {
  return <UserDetailView userId={params.id} />;
}

// ❌ Bad — business logic in page
export default function UserDetailPage({ params }) {
  const user = fetchUser(params.id); // No!
  return <div>{user.name}</div>;
}
```

### Route Groups

Use `(groupName)` for organizing routes without affecting URL path.

```
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
  (dashboard)/
    layout.tsx
    users/page.tsx
    settings/page.tsx
```

### Layouts

Share layout structure with `layout.tsx`. Use for persistent UI (sidebars, headers).

---

## Metadata

All pages must define metadata for SEO:

```ts
// Static
export const metadata: Metadata = {
  title: "Users | MyApp",
  description: "Manage your team members",
};

// Dynamic
export async function generateMetadata({ params }): Promise<Metadata> {
  const user = await getUserById(params.id);
  return {
    title: `${user.name} | MyApp`,
  };
}
```

---

## Performance

### Dynamic Imports

Use for heavy client-only components to avoid SSR issues and reduce initial bundle:

```ts
import dynamic from "next/dynamic"

const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})
```

### Image Optimization

Always use `next/image` instead of `<img>`:

```tsx
import Image from "next/image";
<Image src="/logo.png" alt="Logo" width={120} height={40} priority />;
```

### Large Lists

Never render large lists without pagination or virtualization.

```tsx
// ✅ Server-side pagination with React Query
useQuery({
  queryKey: queryKeys.users.list({ page, pageSize }),
  queryFn: () => getUsers({ page, pageSize }),
});
```

---

## Anti-Patterns

```tsx
// ❌ Fetching data with useEffect in a client component
useEffect(() => {
  fetch("/api/users")
    .then((r) => r.json())
    .then(setUsers);
}, []);
// ✅ Use Server Component fetch or React Query

// ❌ "use client" on a layout or page that doesn't need it
("use client");
export default function Layout({ children }) {
  return <div>{children}</div>;
}

// ❌ Blocking the entire page with a spinner
if (loading) return <FullPageSpinner />;
// ✅ Component-level skeleton
if (loading) return <TableSkeleton />;
```
