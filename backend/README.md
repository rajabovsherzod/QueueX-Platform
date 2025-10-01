# E-Queue Backend API

Multi-tenant SaaS queue management system backend built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- PNPM 8+ (recommended package manager)
- Redis (optional, for caching)

### Installation

1. **Clone and navigate to backend**

```bash
cd backend
```

2. **Install PNPM globally (if not installed)**

```bash
npm install -g pnpm
```

3. **Clean NPM artifacts (if switching from NPM)**

```bash
rm -rf node_modules package-lock.json
```

4. **Install dependencies with PNPM**

```bash
pnpm install
```

5. **Initialize Prisma**

```bash
pnpm exec prisma init
```

6. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

7. **Setup PostgreSQL database**

```sql
-- Create main platform database
CREATE DATABASE e_queue_platform;

-- Create user (optional)
CREATE USER e_queue_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE e_queue_platform TO e_queue_user;
```

8. **Update DATABASE_URL in .env**

```bash
DATABASE_URL="postgresql://e_queue_user:your_password@localhost:5432/e_queue_platform"
```

9. **Generate Prisma client and run migrations**

```bash
pnpm run db:generate
pnpm run db:migrate
```

10. **Seed initial data (optional)**

```bash
pnpm run db:seed
```

11. **Start development server**

```bash
pnpm run dev
```

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Initial data seeding
├── src/
│   ├── shared/            # Shared utilities
│   │   ├── config/        # Database, JWT config
│   │   ├── middleware/    # Auth, validation
│   │   └── utils/         # Helpers
│   ├── features/          # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── users/         # User management
│   │   ├── companies/     # Company management
│   │   ├── queues/        # Queue management
│   │   └── kiosk/         # Kiosk system
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
└── package.json
```

## 🛠️ Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:push` - Push schema changes to database
- `pnpm run db:seed` - Seed initial data
- `pnpm run db:studio` - Open Prisma Studio
- `pnpm run db:reset` - Reset database
- `pnpm test` - Run tests
- `pnpm run lint` - Run ESLint
- `pnpm run clean` - Clean build artifacts
- `pnpm run reinstall` - Clean reinstall dependencies

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

- **DATABASE_URL** - PostgreSQL connection string
- **JWT_SECRET** - Secret key for JWT tokens
- **PORT** - Server port (default: 3000)
- **NODE_ENV** - Environment (development/production)

## 🏗️ Multi-Tenant Architecture

The system supports multiple tenancy with:

- **Platform Database** - Users, companies, cross-tenant data
- **Company Databases** - Separate database per company for data isolation
- **Shared Services** - Authentication, user management
- **Tenant Services** - Company-specific queues, branches, services

## 📊 Database Schema

Key entities:

- **Users** - Multi-role users (Super Admin, Company Admin, Operator, Customer)
- **Companies** - Tenant organizations
- **Branches** - Company locations
- **Services** - Services offered at branches
- **Queues** - Customer queue bookings
- **Kiosk Sessions** - Virtual kiosk interactions

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control (RBAC)**
- **Multi-tenant data isolation**
- **Secure password hashing with bcrypt**

## 🚀 Deployment

1. **Build the application**

```bash
pnpm run build
```

2. **Set production environment variables**

```bash
NODE_ENV=production
DATABASE_URL="your-production-db-url"
```

3. **Run database migrations**

```bash
pnpm run db:migrate:prod
```

4. **Start the server**

```bash
pnpm start
```

## 📝 API Documentation

Once the server is running, API endpoints will be available at:

- `http://localhost:3000/api/auth` - Authentication
- `http://localhost:3000/api/users` - User management
- `http://localhost:3000/api/companies` - Company management
- `http://localhost:3000/api/queues` - Queue management
- `http://localhost:3000/api/kiosk` - Kiosk operations

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch
```

## 📞 Support

For questions and support, contact the development team.
