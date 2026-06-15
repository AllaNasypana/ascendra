# Ascendra Workspaces Dashboard

A take-home implementation of the Ascendra Workspaces platform — a dashboard for managing developer machines, serving both **developers** and **DevOps admins**.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Developer | `alex.chen@ascendra.io` | `password` |
| Admin | `taylor.admin@ascendra.io` | `password` |

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui-style components
- **TanStack Query** for data fetching & cache invalidation
- **Recharts** for utilization visualizations
- **React Hook Form + Zod** for forms
- **react-toastify** for action feedback
- **Next.js Route Handlers** as mock API backed by in-memory store

## Project Structure

```
src/
├── app/
│   ├── (auth)/login, registration
│   ├── (developer)/machines, machines/[id]
│   ├── (admin)/overview, inventory, templates
│   └── api/          # Mock REST endpoints
├── components/       # UI, layout, charts, vm
├── features/         # Developer & admin feature modules
├── lib/              # API client, query client, utils
├── mocks/db.ts       # In-memory data store
└── types/            # Domain TypeScript interfaces
```

---

## Part A — Product & UX Thinking

### How I Read the Brief

The core tension is **two personas with opposite mental models**:

- **Developers** think in terms of *my workspace* — start it, connect to IDE, check if it's healthy.
- **Admins** think in terms of *the fleet* — cost, utilization, idle waste, template governance.

These shouldn't share the same navigation or visual language. I split them into distinct experiences connected by a role-aware switcher (admins can peek at the developer view).

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Separate shells** — light/green developer UI vs dark/indigo admin console | Instant visual context for which "mode" you're in |
| **Card grid for developer VMs, data table for admin inventory** | Developers have few machines (1–3); cards emphasize actions. Admins scan dozens — tables with inline metrics win |
| **Idle VM highlighting** | Directly addresses admin need for efficiency; surfaced in inventory + fleet alert banner |
| **Polling during transitions** | Start/stop/restart are async; refetch every 2s while `starting`/`stopping` gives realistic feedback without WebSocket complexity |
| **"Open in IDE" as external link stub** | Matches brief's vscode-server pattern; clearly actionable without building an embedded IDE |
| **Mock API with simulated delays** | Forces real loading/error/empty states; mutations feel async like production |

### Information Architecture

```
Login
├── Developer (engineer role)
│   └── My Machines → VM Detail (charts, metadata, lifecycle)
└── Admin (admin role)
    ├── Fleet Overview (aggregate metrics + charts)
    ├── VM Inventory (search/filter all VMs)
    └── Templates (CRUD)
```

Admins with dual access can switch between Developer View and Admin Console via sidebar.

### Flows Prioritized

1. **Developer: see machines → start → open IDE** — the daily loop
2. **Developer: VM detail with usage charts** — trust that the machine is working
3. **Admin: fleet overview at a glance** — health check in <10 seconds
4. **Admin: inventory with idle detection** — cost optimization
5. **Admin: template management** — infrastructure governance

### Intentionally Left Out (with more time)

- Policies & quotas UI (data model exists in mock DB)
- Users & teams management
- WebSocket real-time updates
- Per-VM activity logs
- Dark mode toggle (admin is always dark; developer is light)
- Deployment URL (run locally; deploy to Vercel is straightforward)

---

## Features Implemented

### Developer
- My Machines list with status, template, resource usage
- Start / Stop / Restart with transition states
- Open in IDE (external link)
- VM detail: 24h CPU/memory charts, specs, uptime, metadata

### Admin
- Fleet overview: VM counts, avg/peak utilization, cost metrics
- Fleet utilization charts (24h trend + per-VM CPU distribution)
- VM inventory: searchable, filterable, idle highlighting
- Templates: list, create, edit (React Hook Form + Zod)

### Cross-cutting
- Loading skeletons, empty states, error retry
- Toast notifications for mutations
- Typed API client + TanStack Query
- Responsive layout with semantic markup

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate |
| POST | `/api/auth/register` | Register engineer |
| GET | `/api/auth/me?userId=` | Get current user |
| GET | `/api/vms?ownerId=` | List VMs |
| GET | `/api/vms/:id` | Get VM |
| GET | `/api/vms/:id/metrics` | VM usage history |
| POST | `/api/vms/:id/start\|stop\|restart` | Lifecycle actions |
| GET/POST | `/api/templates` | List/create templates |
| PATCH | `/api/templates/:id` | Update template |
| GET | `/api/fleet` | Fleet utilization snapshot |
