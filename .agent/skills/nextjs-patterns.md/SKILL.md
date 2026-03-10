---
name: nextjs-patterns
description: Knowledge of App Router, Server Components vs Client Components
---

# Next.js Patterns Skill

## Server vs Client

- Prefira Server Components para fetch de dados iniciais.
- Use `'use client'` apenas quando houver interatividade (hooks, onClick).

## Optimization

- Use `next/image` para todos os assets.
- Implemente `loading.tsx` para streaming de UI.
