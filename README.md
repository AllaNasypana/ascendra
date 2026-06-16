# Ascendra Workspaces Dashboard

## Overview

Ascendra Workspaces is a dashboard for managing cloud-based developer machines. It serves two roles:

- **Developer** — engineers who run daily work on their own VMs: start machines, open an IDE, and monitor resource usage.
- **Admin** — DevOps / DevEx operators who need fleet-wide visibility into utilization, cost, templates, and inefficient or overloaded machines.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- Recharts
- React Hook Form
- Zod
- Next.js Route Handlers (mock API)

## Product Decisions

- **Two distinct experiences** — separate navigation, layout, and visual tone for developers (card-based “My Machines”) vs admins (metrics, tables, governance).
- **Persona-first information architecture** — developers see only their VMs; admins see the full fleet, inventory, and templates.
- **Cards for developers, tables for admins** — few machines per developer favor action-oriented cards; admins scan many rows with inline utilization.
- **Efficiency signals for admins** — idle VMs are highlighted in inventory; fleet overview surfaces idle and hot running machines.
- **Realistic async behavior** — mock API delays, polling during VM transitions, and toast feedback for lifecycle actions.

## Features

### Developer

- Login and engineer registration
- **My Machines** — VM cards with status, template, region, and CPU / memory / disk usage
- **Open in IDE** — external link to a vscode-server-style URL (stub)
- **Lifecycle controls** — start, stop, and restart with starting / stopping states
- **VM detail** — 24h CPU and memory charts, template specs, uptime, and metadata

### Admin

- **Fleet overview** — total, running, and stopped VMs; engineer count; avg/peak CPU and memory; hourly, month-to-date, and projected monthly cost; 24h utilization trend chart; idle and hot VM alerts
- **VM inventory** — searchable, filterable, sortable table of all VMs with owner, template, status, utilization, and cost; idle VMs highlighted; VM detail drill-down (read-only)
- **Templates** — list, create, and edit templates (name, vCPU, memory, disk, base image, preinstalled tools)

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo accounts** (password: `password123`)

| Role      | Email                      |
| --------- | -------------------------- |
| Developer | `alex.chen@ascendra.io`    |
| Admin     | `taylor.admin@ascendra.io` |

## Architecture

- **UI layer** — Next.js App Router pages compose feature modules under `src/features/`; shared UI lives in `src/components/`.
- **API layer** — typed client (`src/lib/api-client.ts`) calls Next.js Route Handlers; no data is hardcoded in components.
- **Mock backend** — in-memory store (`src/mocks/store.ts`) seeded on startup; simulated network delay on API routes.
- **TanStack Query** — server state, loading/error/empty handling, and cache invalidation after VM and template mutations.
- **Feature hooks** — data fetching and transformations live in hooks and helpers (e.g. fleet metrics, VM health, inventory filtering).
- **URL-driven inventory state** — search, status filter, and column sort are stored in query params (`q`, `status`, `sort`, `order`) for shareable, refresh-safe views.
- **Auth** — session stored in `localStorage`; role-based route guards redirect engineers and admins to the correct area.

## Trade-offs

- **Mock data only** — fleet trend is synthetic; VM metrics are seeded, not collected from a real telemetry pipeline.
- **Simplified billing** — cost and utilization apply to running VMs only; month-to-date assumes day 13 of the month; projected monthly = hourly × 24 × 30.
- **Idle / hot detection** — rule-based thresholds (idle: CPU &lt;5% + inactive &gt;30m; hot: CPU ≥80% or memory ≥85%), surfaced as alerts and inventory highlights rather than a separate distribution chart.
- **Polling, not WebSockets** — VM lists and details refetch on an interval during `starting` / `stopping` transitions.
- **Policies not built** — policy records exist in the mock database but have no admin UI.
- **Local auth** — user ID in `localStorage`; suitable for a demo, not production security.

## Future Improvements

- Real authentication (sessions, JWT, or OAuth) and server-side authorization
- Persistent database and real metrics / billing integrations
- WebSocket or SSE for live fleet and VM updates
- Policies and quotas UI (max VMs per developer, idle auto-stop)
- Users and teams management with per-user utilization
- Per-VM activity logs and richer fleet distribution visualizations
- Deployment to a hosted environment with CI/CD
