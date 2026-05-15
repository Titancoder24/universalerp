# Universal ERP

The complete business management platform — CRM, accounting, HR, inventory, manufacturing, projects, chat, and more — delivered as one application.

## What you get

- **100+ modules** across 14 pillars (Sales, CRM, HRMS, Operations, Manufacturing, Inventory, Procurement, Accounting, Projects, Quality, Assets, Customer Service, Communication, Reports, Platform tools)
- **True multi-tenancy** with PostgreSQL row-level security
- **25 visual themes** with 60 design tokens each, 18 icon families, and any Google Font
- **Customer & vendor portals** branded as the tenant
- **Slack-grade chat** woven through every record
- **AI integration** through OpenRouter (optional)
- **PWA mobile experience** with offline mode and Web Push
- **Self-hostable** on a single VPS via Docker Compose

## Quick start (local development)

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase URL + keys (or PostgreSQL DATABASE_URL for self-host)

# 3. Run database migrations
pnpm db:migrate

# 4. Seed sample data (optional)
pnpm db:seed

# 5. Start the dev server
pnpm dev
```

Open http://localhost:3000 to see the landing page, then visit `/signup` to create your first workspace.

## Self-hosted deployment

The full platform runs on a single VPS via Docker Compose:

```bash
git clone https://github.com/titancoder24/universalerp.git
cd universalerp
cp .env.example .env
# Configure DOMAIN, JWT_SECRET, POSTGRES_PASSWORD in .env
docker compose up -d
docker compose exec app pnpm db:migrate
docker compose exec app pnpm db:seed
```

The Compose bundle includes:

- PostgreSQL 16
- Supabase Auth (GoTrue)
- Supabase Storage
- Supabase Realtime
- PostgREST (auto-generated REST API)
- Kong API gateway
- Next.js app server
- Caddy reverse proxy with automatic Let's Encrypt SSL
- mediasoup SFU for voice/video calls

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser / PWA                                  │
│  ├─ Next.js 15 (App Router, RSC, Turbopack)     │
│  ├─ TanStack Query for client state             │
│  ├─ Supabase realtime channels                  │
│  └─ Service Worker for offline + Web Push       │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │      Kong Gateway       │
        └────┬───────┬───────┬────┘
             │       │       │
        ┌────▼─┐ ┌──▼──┐ ┌──▼────┐
        │ Auth │ │REST │ │Storage│
        └──┬───┘ └──┬──┘ └──┬────┘
           │        │       │
        ┌──▼────────▼───────▼─┐
        │   PostgreSQL 16     │
        │  + RLS + pgcrypto   │
        │  + pg_trgm + citext │
        └─────────────────────┘
```

## Key directories

```
src/
├── app/                 # Next.js routes (App Router)
│   ├── (auth)/         # Login, signup, password reset
│   ├── (app)/          # Authenticated app surface
│   ├── (portal)/       # Customer and vendor portals
│   └── (admin)/        # Super admin console
├── components/         # Shared React components
│   ├── ui/            # shadcn-style design system primitives
│   ├── app-shell/     # Sidebar, topbar, command palette
│   └── providers/     # Theme, query, tenant contexts
├── modules/           # Module-specific feature code (chat, sales, etc.)
├── lib/               # Shared utilities
│   ├── theme/         # 25 presets, runtime, fonts, icons
│   ├── modules/       # Module registry
│   ├── supabase/      # Client & server Supabase wrappers
│   ├── auth/          # Session helpers
│   └── database/      # Type definitions
└── middleware.ts      # Auth middleware

supabase/migrations/   # SQL migrations (8 files, ~4000 lines)
infra/                 # Caddy + Kong configs
public/                # Static assets, PWA manifest, service worker
```

## Tech stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI primitives
- **Charts**: Recharts
- **Tables**: TanStack Table v8 with virtualization
- **State**: TanStack Query, Zustand for ephemeral UI state
- **Forms**: react-hook-form + zod
- **Database**: PostgreSQL 16 with RLS, triggers, generated columns
- **Auth**: Supabase Auth (or any GoTrue-compatible provider)
- **Realtime**: Supabase Realtime (Postgres logical replication)
- **Storage**: Supabase Storage (or any S3-compatible service)
- **AI**: OpenRouter for model access; 300+ models from 60+ providers via one API
- **Search**: pg_trgm for fuzzy text search; tsvector for full-text where needed

## License

This codebase is structured to be sold or distributed under a license of your choosing — see `LICENSE`. The self-host deployment intentionally has no external paid dependencies beyond optional OpenRouter.
