# Design: Family Income Dashboard MVP

Date: 2026-02-24
Branch: feature/family-income-dashboard

## Problem

A family of 2 needs to track multiple income sources (main job, freelance, consulting, side projects), see cumulative totals over time, understand diversification risk (over-dependency on one source), and decide which sources to grow or stop.

## Approach

A 3-page sidebar dashboard MVP with:
- **Dashboard** `/` — KPI cards + stacked area chart (cumulative income) + donut chart (source breakdown)
- **Income Sources** `/income-sources` — CRUD table for income source definitions
- **Income Entries** `/income-entries` — CRUD table for monthly income records with period filter

**Key design decisions:**
- Amounts in cents (integer math, no float rounding issues)
- One entry per source per month (UNIQUE constraint)
- `isActive` flag for soft-delete (preserves chart history)
- Server Components by default; `"use client"` only for forms, charts, and interactive state
- Mock data via `useState` hooks — later swapped to API calls with zero UI changes
- Route group `(dashboard)` for shared sidebar layout, clean URLs

## Architecture

**Layout:** Route group `(dashboard)` wraps all 3 pages with `SidebarProvider` + `AppSidebar` + `SidebarInset`. The sidebar uses `usePathname()` for active nav state highlighting.

**Server vs Client Component split** (push `"use client"` to the leaves):

| Layer | Server Component | Client Component |
|-------|-----------------|------------------|
| `(dashboard)/layout.tsx` | Yes — wraps children in SidebarProvider | — |
| `app-sidebar.tsx` | — | Yes — needs `usePathname()` |
| `(dashboard)/page.tsx` | — | Yes — owns period/owner filter state |
| KPI cards, charts | — | Yes — consume dynamic data from hooks |
| Forms (source, entry) | — | Yes — React Hook Form + Zod |
| Tables (sources, entries) | — | Yes — interactive actions |

**State management:**
- **Filter state** (period, owner) — lifted to dashboard page, passed as props
- **CRUD state** — `useState` inside custom hooks, simulating backend
- **URL state** — none for MVP (filters are ephemeral)

**Data flow:**
```
Page (filter state)
  → useDashboardData(period, ownerId) → aggregates from mock data
  → KpiCards(dashboardData)
  → IncomeAreaChart(months, sources)
  → IncomeDonutChart(months, sources)
```

No data waterfalls — all data derived synchronously from in-memory mock data. When backend arrives, hooks become async with SWR or React.use().

## UI Behavior

**Dashboard page user flow:**
1. User lands on `/` — sees KPIs, stacked area chart, donut chart for current year
2. **Period selector** — Tabs for Monthly/Quarterly/Yearly/Custom. Monthly shows single month picker, Quarterly shows quarter+year select, Yearly shows year select, Custom shows start+end month pickers
3. **Owner filter** — "All" / "Volodymyr" / "Дружина" tabs — filters all KPIs and charts by whose income sources
4. Charts and KPIs re-render instantly (in-memory data)

**KPI cards behavior:**
- **Total Income** — formatted as `₴ XX,XXX.XX` (cents → UAH with 2 decimals)
- **Active Sources** — count of `isActive: true` sources
- **Dependency Risk** — `topSourcePercentage` shown as %. If >50%, card gets destructive styling (red)

**Income Sources page (`/income-sources`):**
- Table columns: color dot, name, owner, status badge (active/inactive), actions (edit, delete)
- "Add Source" button opens dialog with form: name, owner (select), color (color picker)
- Edit opens same dialog pre-filled
- Delete removes source + cascades entries from memory
- Toggle active/inactive via dropdown menu action

**Income Entries page (`/income-entries`):**
- Table columns: month, source name (with color dot), amount, note, actions
- Period filter at top (same component as dashboard)
- "Add Entry" button opens dialog: source (select), amount (UAH, stored as cents), month, note (optional)
- Validation: one entry per source per month

**Edge cases:**
- No sources → empty state message on tables and charts
- No entries for period → charts show flat zero, KPIs show ₴0
- All sources inactive → Active Sources shows 0, dependency risk shows 0%

## Components

**Component hierarchy:**

```
(dashboard)/layout.tsx (Server)
├── AppSidebar (Client) — nav items, usePathname active state
└── SidebarInset → page content

Dashboard page (Client) — owns periodFilter + ownerFilter state
├── PeriodSelector({ value, onChange })
├── OwnerFilter — inline Tabs (All / Volodymyr / Дружина)
├── KpiCards({ dashboardData })
├── IncomeAreaChart({ months, sources })
└── IncomeDonutChart({ months, sources })

Income Sources page (Client)
├── IncomeSourcesTable({ sources, onEdit, onDelete, onToggle })
└── IncomeSourceForm({ source?, onSubmit, open, onOpenChange })

Income Entries page (Client) — owns periodFilter state
├── PeriodSelector({ value, onChange })
├── IncomeEntriesTable({ entries, sources, onEdit, onDelete })
└── IncomeEntryForm({ entry?, sources, onSubmit, open, onOpenChange })
```

**Key props interfaces:**
- `PeriodSelector` — controlled: `value: PeriodFilter`, `onChange: (filter: PeriodFilter) => void`
- `KpiCards` — receives pre-computed `DashboardData`
- Chart components — receive `months: MonthlyAggregation[]` and `sources: IncomeSource[]`
- Form components — `source?`/`entry?` optional = add mode when undefined, edit when provided
- Table components — receive data arrays + callback handlers, no internal state

**Shared utilities:**
- `formatCurrency(cents)` — cents → `₴ XX,XXX.XX` localized
- `formatMonth(monthStr)` — "YYYY-MM" → "Січень 2026"
- `getCurrentMonth()` → current "YYYY-MM"
- `getDefaultPeriodFilter()` → yearly filter for current year

## Out of Scope

- Expenses tracking — income only
- Authentication / authorization — hardcoded 2 family members
- Backend API integration — mock data, API contract documented separately
- Database — schema documented for backend team
- Multi-household, currency selection, data persistence
- Export / import (CSV/PDF)
- i18n — UI labels in English, Ukrainian names in data only
- Testing setup — build+lint as verification
