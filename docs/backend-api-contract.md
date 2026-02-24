# Backend API Contract — Family Income Dashboard

> This document defines the API contract between the frontend (Next.js) and backend (NestJS + PostgreSQL/Supabase).
> Frontend is being built with mock data matching these exact types and endpoints.
> Backend team can start development using this contract immediately.

## Base URL

```
/api/v1
```

## Data Types

### FamilyMember

```typescript
type FamilyMember = {
  id: string       // UUID
  name: string     // e.g. "Volodymyr", "Дружина"
}
```

### IncomeSource

```typescript
type IncomeSource = {
  id: string         // UUID
  name: string       // free-text, e.g. "Музичний канал", "Фріланс React"
  ownerId: string    // FamilyMember.id — whose income source
  color: string      // hex color, e.g. "#4f46e5"
  isActive: boolean  // soft-delete flag
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
}
```

### IncomeEntry

```typescript
type IncomeEntry = {
  id: string         // UUID
  sourceId: string   // IncomeSource.id
  amount: number     // integer, cents (e.g. 150000 = ₴1,500.00)
  month: string      // "YYYY-MM" format, e.g. "2026-01"
  note: string       // optional description
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
}
```

### DashboardData

```typescript
type MonthlyAggregation = {
  month: string                    // "YYYY-MM"
  total: number                    // cents
  sources: Record<string, number>  // sourceId → cents
}

type DashboardData = {
  period: { type: string; startMonth: string; endMonth: string }
  months: MonthlyAggregation[]
  totalIncome: number              // cents, sum for period
  activeSourcesCount: number
  topSourceId: string
  topSourcePercentage: number      // 0-100
}
```

---

## Endpoints

### Income Sources

#### GET `/api/v1/income-sources`

Returns all income sources for the household.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Основна робота",
    "ownerId": "uuid",
    "color": "#4f46e5",
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-01-15T10:00:00Z"
  }
]
```

#### POST `/api/v1/income-sources`

Create a new income source.

**Request body:**
```json
{
  "name": "Фріланс React",
  "ownerId": "uuid",
  "color": "#06b6d4"
}
```

**Validation:**
- `name`: required, max 100 characters
- `ownerId`: required, valid UUID, must be a household member
- `color`: required, valid hex color

**Response:** `201 Created` → `IncomeSource`

#### PATCH `/api/v1/income-sources/:id`

Update an existing income source. All fields optional.

**Request body:**
```json
{
  "name": "Updated name",
  "ownerId": "uuid",
  "color": "#new-color",
  "isActive": false
}
```

**Response:** `200 OK` → `IncomeSource`
**Error:** `404 Not Found` if source doesn't exist

#### DELETE `/api/v1/income-sources/:id`

Delete an income source and all its entries (cascade).

**Response:** `204 No Content`
**Error:** `404 Not Found` if source doesn't exist

---

### Income Entries

#### GET `/api/v1/income-entries?startMonth=YYYY-MM&endMonth=YYYY-MM`

Returns income entries filtered by period.

**Query params:**
- `startMonth` (required): "YYYY-MM" format
- `endMonth` (required): "YYYY-MM" format

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "sourceId": "uuid",
    "amount": 150000,
    "month": "2026-01",
    "note": "Повна зарплата",
    "createdAt": "2026-01-31T10:00:00Z",
    "updatedAt": "2026-01-31T10:00:00Z"
  }
]
```

#### POST `/api/v1/income-entries`

Create a new income entry.

**Request body:**
```json
{
  "sourceId": "uuid",
  "amount": 150000,
  "month": "2026-01",
  "note": "Повна зарплата"
}
```

**Validation:**
- `sourceId`: required, valid UUID, must reference existing active source
- `amount`: required, positive integer (cents)
- `month`: required, "YYYY-MM" format
- `note`: optional string
- **UNIQUE constraint**: one entry per (sourceId, month) pair

**Response:** `201 Created` → `IncomeEntry`
**Error:** `409 Conflict` if entry for this source+month already exists

#### PATCH `/api/v1/income-entries/:id`

Update an existing entry. All fields optional.

**Request body:**
```json
{
  "amount": 160000,
  "month": "2026-02",
  "note": "Updated note"
}
```

**Response:** `200 OK` → `IncomeEntry`
**Error:** `404 Not Found`, `409 Conflict` (if month change causes duplicate)

#### DELETE `/api/v1/income-entries/:id`

**Response:** `204 No Content`
**Error:** `404 Not Found`

---

### Dashboard (Aggregation)

#### GET `/api/v1/dashboard?startMonth=YYYY-MM&endMonth=YYYY-MM&ownerId=UUID`

Pre-aggregated dashboard data for the period.

**Query params:**
- `startMonth` (required): "YYYY-MM"
- `endMonth` (required): "YYYY-MM"
- `ownerId` (optional): UUID — filter by family member. Omit for all members.

**Response:** `200 OK`
```json
{
  "period": {
    "type": "yearly",
    "startMonth": "2026-01",
    "endMonth": "2026-12"
  },
  "months": [
    {
      "month": "2026-01",
      "total": 350000,
      "sources": {
        "source-uuid-1": 150000,
        "source-uuid-2": 120000,
        "source-uuid-3": 80000
      }
    }
  ],
  "totalIncome": 4200000,
  "activeSourcesCount": 5,
  "topSourceId": "source-uuid-1",
  "topSourcePercentage": 42.8
}
```

---

## Database Schema (PostgreSQL / Supabase)

```sql
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Family',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE household_members (
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (household_id, user_id)
);

CREATE TABLE income_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  color TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE income_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES income_sources(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  month TEXT NOT NULL CHECK (month ~ '^\d{4}-\d{2}$'),
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (source_id, month)
);

CREATE INDEX idx_income_entries_month ON income_entries(month);
CREATE INDEX idx_income_entries_source_month ON income_entries(source_id, month);
CREATE INDEX idx_income_sources_household ON income_sources(household_id);
```

**Key decisions:**
- Amounts in **cents** (integer) — no float precision issues
- `UNIQUE(source_id, month)` — one entry per source per month
- `is_active` for soft-delete — preserves historical data for charts
- Cascade delete from sources to entries
- Month stored as TEXT "YYYY-MM" with regex check constraint

---

## Notes for Backend Team

1. **Authentication** is not implemented yet — build endpoints without auth first, add middleware later
2. **Household scoping** — all queries should scope to the user's household (when auth is added)
3. **Response format** — use camelCase JSON keys (matching TypeScript types above)
4. **Error format** — `{ "error": "Human readable message", "code": "MACHINE_CODE" }`
5. **Pagination** — not needed for MVP (expect <100 sources, <1200 entries per household)
6. The frontend dashboard endpoint (`/api/v1/dashboard`) can be computed server-side or the frontend can aggregate from raw entries — backend team decides the approach
