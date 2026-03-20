# Workspace

## Overview

pnpm workspace monorepo using TypeScript. This is the **Wisata Indonesia** tourism platform — a full-featured Indonesian travel website with public-facing pages and an admin dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Frontend**: React + Vite, Tailwind CSS, ShadCN UI
- **State Management**: TanStack React Query
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (all REST endpoints)
│   └── wisata-indonesia/   # React + Vite frontend (public site + admin)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Platform Features

### Public Website
- **Beranda** (Homepage): Hero with dynamic banners, featured packages, testimonials, CTA
- **Paket Wisata**: Tour packages with province/city/price/duration filters
- **Rental Mobil**: Vehicle fleet with type filters and booking
- **Galeri**: Photo gallery with category filter
- **Blog**: SEO articles with category/tag filters
- **Custom Trip**: Custom trip request form

### Admin Dashboard (`/admin`)
- **Dashboard**: Stats (revenue, orders, packages, custom trips)
- **Pesanan**: All bookings management
- **Custom Trip**: Custom trip request management
- **Paket Wisata**: Package CRUD
- **Wilayah**: Province/city/destination management
- **Kendaraan**: Vehicle/rental fleet management
- **Galeri**: Gallery management
- **Blog**: Article management
- **Banner**: Hero banner management
- **Testimoni**: Review moderation

## Database Schema

Key tables: `provinces`, `cities`, `destinations`, `packages`, `vehicles`, `bookings`, `gallery`, `blog_posts`, `testimonials`, `banners`, `custom_trips`

## API Routes

All routes prefixed with `/api`:
- `/provinces`, `/cities`, `/destinations` — Region management
- `/packages` — Tour packages (filters: provinceId, cityId, minPrice, maxPrice, duration, featured)
- `/vehicles` — Rental vehicles (filters: type, available)
- `/bookings` — Booking management
- `/gallery` — Gallery items
- `/blog` — Blog posts
- `/testimonials` — Customer reviews
- `/banners` — Hero banners
- `/admin/stats` — Dashboard statistics
- `/admin/custom-trips` — Custom trip requests

## Development

- Run `pnpm --filter @workspace/api-spec run codegen` after changing OpenAPI spec
- Run `pnpm --filter @workspace/db run push` after changing DB schema
- Currency: Indonesian Rupiah (IDR) format: Rp X.XXX.XXX
