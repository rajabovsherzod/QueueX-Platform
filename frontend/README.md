# E-Queue Frontend

Multi-tenant queue management system frontend applications.

## Architecture

This is a monorepo containing:

### Apps

- **super-admin** (Port 3001) - SuperAdmin interface
  - `admin.e-queue.com` - SuperAdmin panel
- **company-admin** (Port 3002) - Company Admin & Branch Admin interfaces
  - `company.e-queue.com` - Company admin panel (subdomain routing)
  - Role-based routing for Branch Admins within company
- **customer-app** (Port 3003) - Customer queue interface
  - `e-queue.com/company/queue` - Customer interface

### Packages

- **@e-queue/ui** - Shared UI components (Radix UI + Tailwind)
- **@e-queue/api** - API client and utilities
- **@e-queue/types** - Shared TypeScript types

## Development Setup

```bash
# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Start specific app
pnpm --filter super-admin dev
pnpm --filter company-admin dev
pnpm --filter customer-app dev

# Build all apps
pnpm build
```

## URLs

### Development

- SuperAdmin: http://localhost:3001
- Company Admin: http://localhost:3002
- Customer App: http://localhost:3003
- Backend API: http://localhost:5000

### Production

- SuperAdmin: https://admin.e-queue.com
- Company Admin: https://company.e-queue.com (with subdomain routing)
- Customer App: https://e-queue.com
- Backend API: https://api.e-queue.com

## Deployment Strategy

### SuperAdmin App

- Domain: `admin.e-queue.com`
- Features: Companies CRUD, System analytics, Global settings

### Company Admin App

- Domain: `*.e-queue.com` (wildcard subdomain)
- Features: Company dashboard, Branch management, Role-based access
- Branch Admin access within same app via role permissions

### Customer App

- Domain: `e-queue.com`
- Path-based routing: `/company/queue`
- Features: Queue interface, Real-time updates, Mobile-first

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **API Client**: TanStack Query + Axios
- **Forms**: React Hook Form + Zod
- **Build System**: Turbo
- **Package Manager**: pnpm
