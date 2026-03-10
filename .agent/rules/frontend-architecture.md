---
trigger: always_on
---

# Frontend Architecture Rules

Maintain a clean and scalable architecture.

## Folder Structure

Use the following structure:

app/
components/
hooks/
services/
stores/
schemas/
utils/
lib/

---

## API Layer

All API calls must go through a shared API client.

Avoid calling fetch directly inside components.

Use service functions.

Example:

services/users/getUsers.ts

---

## Business Logic

Avoid business logic in components.

Components should:

- render UI
- trigger actions

Business logic should live in:

- hooks
- services
