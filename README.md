# Family Income Dashboard

A family financial dashboard for tracking income sources and diversification.
Add different income sources (main job, freelance, consulting, side projects),
see cumulative income over time, and understand which sources to grow or stop.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** with TypeScript 5 (strict mode)
- **Tailwind CSS v4** (CSS-first config)
- **shadcn/ui** (New York style, Radix UI primitives)
- **Recharts** for charts (via shadcn ChartContainer wrapper)
- **React Hook Form + Zod** for form validation
- **Node.js 22** (see `.nvmrc`)

## Quick Start

```bash
# Switch to correct Node version
nvm use

# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the dashboard with mock data.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/              # Route group — sidebar layout, clean URLs
│   │   ├── layout.tsx            # SidebarProvider + AppSidebar + SidebarInset
│   │   ├── page.tsx              # Dashboard: KPIs + charts (/)
│   │   ├── income-sources/
│   │   │   └── page.tsx          # CRUD table for income sources (/income-sources)
│   │   └── income-entries/
│   │       └── page.tsx          # CRUD table for income entries (/income-entries)
│   ├── globals.css               # Tailwind v4 theme (@theme, CSS variables)
│   └── layout.tsx                # Root layout (fonts, metadata)
├── components/
│   ├── ui/                       # shadcn/ui components (do not edit directly)
│   ├── app-sidebar.tsx           # Sidebar navigation with active state
│   ├── period-selector.tsx       # Monthly/Quarterly/Yearly/Custom filter
│   ├── kpi-cards.tsx             # Total Income, Active Sources, Dependency Risk
│   ├── income-area-chart.tsx     # Stacked area chart (income over time)
│   ├── income-donut-chart.tsx    # Donut chart (income breakdown by source)
│   ├── income-source-form.tsx    # Dialog form for add/edit source
│   ├── income-sources-table.tsx  # Table with actions (edit, toggle, delete)
│   ├── income-entry-form.tsx     # Dialog form for add/edit entry
│   └── income-entries-table.tsx  # Table with actions (edit, delete)
├── hooks/
│   └── use-income-data.ts        # useIncomeSources, useIncomeEntries, useDashboardData
├── lib/
│   ├── format.ts                 # formatCurrency, formatMonth, getDefaultPeriodFilter
│   ├── mock-data.ts              # Sample data: 6 sources, 12 months of entries
│   ├── schemas.ts                # Zod validation schemas for forms
│   └── utils.ts                  # cn() utility for class merging
├── types/
│   └── income.ts                 # Domain types: IncomeSource, IncomeEntry, DashboardData
docs/
├── designs/                      # Design documents
├── plans/                        # Implementation plans
└── backend-api-contract.md       # API contract for backend team
```

## Pages & Features

### Dashboard (`/`)

- **KPI Cards** — Total Income (UAH), Active Sources count, Dependency Risk (% of largest source; turns red when >50%)
- **Stacked Area Chart** — income over time, each source as a colored layer, shows cumulative growth
- **Donut Chart** — percentage breakdown of income by source
- **Period Filter** — Monthly, Quarterly, Yearly, or Custom date range
- **Owner Filter** — All / Volodymyr / Дружина — filters charts and KPIs by family member

### Income Sources (`/income-sources`)

- Table with color dot, name, owner, active/inactive badge
- Actions: Edit, Toggle active/inactive, Delete
- Add Source dialog: name, owner (select), color (picker + presets)

### Income Entries (`/income-entries`)

- Table with month, source (with color dot), amount (UAH), note
- Period filter to narrow visible entries
- Actions: Edit, Delete
- Add Entry dialog: source (select), amount in UAH, month, note (optional)
- Amounts entered in UAH, stored internally as cents (integer math)

## Data Layer

### Current: Mock Data (In-Memory)

All data lives in React `useState` hooks initialized from `src/lib/mock-data.ts`. CRUD operations work within a single page session but **do not persist across page navigation or refresh** — this is intentional for the MVP.

Three hooks in `src/hooks/use-income-data.ts`:

| Hook | Returns | Purpose |
|------|---------|---------|
| `useIncomeSources()` | `{ sources, addSource, updateSource, deleteSource }` | CRUD for income sources |
| `useIncomeEntries()` | `{ entries, addEntry, updateEntry, deleteEntry }` | CRUD for income entries |
| `useDashboardData(sources, entries, period, ownerId?)` | `DashboardData` | Aggregates totals, top source, monthly breakdowns |

### Migration to Backend API

When the backend (NestJS + PostgreSQL) is ready, replace the hooks internals with API calls. The component interfaces stay the same — no UI changes needed.

- API contract: `docs/backend-api-contract.md`
- Database schema: included in the contract document
- Recommended: use SWR or React Query to replace `useState` with server state

## Development

### Commands

```bash
nvm use              # Switch to Node 22
npm run dev          # Dev server (Turbopack) — localhost:3000
npm run build        # Production build + TypeScript check
npm run lint         # ESLint
```

### Conventions

- **Import alias:** `@/*` maps to `./src/*`
- **Server Components** by default; add `"use client"` only when needed
- **Strict TypeScript:** no `any` types, no `@ts-ignore`
- **Tailwind v4:** theme defined via `@theme` in `globals.css`, not a config file
- **Amounts in cents:** all monetary values stored as integers (e.g., `8000000` = ₴80,000)

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component>
```

Components are added to `src/components/ui/`. Do not edit them directly unless customizing.
