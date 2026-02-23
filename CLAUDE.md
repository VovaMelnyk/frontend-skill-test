# Frontend Skill Test — Dashboard/Admin Panel

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** (CSS-first config — no `tailwind.config.js`)
- **shadcn/ui** (New York style, Lucide icons, Radix UI primitives)
- **Node.js 22** (see `.nvmrc`)
- **npm** as package manager

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
    globals.css  # Tailwind v4 theme (@theme directive, CSS variables)
    layout.tsx   # Root layout
    page.tsx     # Home page
  components/
    ui/          # shadcn/ui components (do not edit directly unless customizing)
  hooks/         # Custom React hooks (e.g., use-mobile.ts)
  lib/
    utils.ts     # cn() utility for class merging
public/          # Static assets
```

## Commands

```bash
nvm use              # Switch to Node 22
npm run dev          # Dev server (Turbopack) — localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Conventions

- **Import alias**: `@/*` maps to `./src/*`
- **Tailwind v4**: Theme is defined via `@theme` in `globals.css`, not in a config file
- **shadcn/ui**: Add new components with `npx shadcn@latest add <component>`
- **Server Components** by default; add `"use client"` only when needed
- **Strict TypeScript**: No `any` types, no `@ts-ignore`

## Architecture Notes

- This is the frontend for a dashboard/admin panel
- Backend is a separate NestJS + PostgreSQL (Supabase) repository
- No authentication is implemented yet
