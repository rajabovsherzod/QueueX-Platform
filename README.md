# E-Queue Platform - SuperAdmin Company Management API

Professional multi-tenant SaaS platform for queue management with dynamic database creation and subdomain routing.

## 🚀 Features

- **SuperAdmin Management**: Complete CRUD operations for companies
- **Multi-tenant Architecture**: Dynamic database creation per company
- **Subdomain Routing**: Company-specific URLs (company.equeue.local)
- **File Upload System**: Professional logo management with validation
- **Authentication & Authorization**: JWT-based security with role management
- **Database Isolation**: Separate databases for each company tenant

## 🛠 Development Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Environment Configuration

Copy environment file:

```bash
cp backend/.env.example backend/.env
```

Update the following variables in `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/equeue_main?schema=public"
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-here
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=$2a$10$hashedPasswordHere
```

### 2. Hosts File Configuration

For subdomain testing, add these entries to your hosts file:

**Windows** (`C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1 equeue.local
127.0.0.1 company1.equeue.local
127.0.0.1 company2.equeue.local
127.0.0.1 testcompany.equeue.local
```

**macOS/Linux** (`/etc/hosts`):

```
127.0.0.1 equeue.local
127.0.0.1 company1.equeue.local
127.0.0.1 company2.equeue.local
127.0.0.1 testcompany.equeue.local
```

### 3. Start Services

```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start individual services
docker-compose up postgres redis -d
cd backend && npm run dev
```

### 4. Database Setup

```bash
# Run Prisma migrations
cd backend
npx prisma migrate dev
npx prisma generate
```

## 🧪 Testing

### SuperAdmin API Testing

1. **Login as SuperAdmin**:

```bash
POST http://equeue.local/api/superadmin/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "your-password"
}
```

2. **Create Company**:

```bash
POST http://equeue.local/api/superadmin/companies
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Test Company",
  "slug": "testcompany",
  "description": "Test company description"
}
```

3. **Upload Company Logo**:

```bash
POST http://equeue.local/api/superadmin/companies/{companyId}/logo
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

logo: [image file]
```

### Company Subdomain Testing

After creating a company with slug "testcompany":

1. **Access Company Dashboard**:

```bash
GET http://testcompany.equeue.local/api/company/dashboard
Authorization: Bearer COMPANY_USER_JWT_TOKEN
```

2. **Development Mode** (using query parameter):

```bash
GET http://equeue.local/api/company/dashboard?tenant=testcompany
Authorization: Bearer COMPANY_USER_JWT_TOKEN
```

## 🏗 Architecture

### Multi-tenant Database Structure

- **Main Database**: `equeue_main` - stores company metadata
- **Tenant Databases**: `equeue_company_{companyId}` - isolated company data

### Subdomain Routing

- **Main Domain**: `equeue.local` - SuperAdmin panel
- **Company Subdomains**: `{company-slug}.equeue.local` - Company-specific interfaces

### API Endpoints

#### SuperAdmin Routes (`/api/superadmin`)

- `POST /login` - SuperAdmin authentication
- `GET /companies` - List all companies
- `POST /companies` - Create new company
- `GET /companies/:id` - Get company details
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company
- `POST /companies/:id/logo` - Upload company logo

#### Company Routes (`/api/company`)

- `GET /dashboard` - Company dashboard data
- `GET /info` - Company information
- `PUT /settings` - Update company settings
- `GET /queues` - List queues
- `POST /queues` - Create queue
- `GET /services` - List services
- `POST /services` - Create service
- `GET /customers` - List customers
- `GET /analytics/*` - Analytics endpoints

## 🔧 Configuration

### Nginx Configuration

The system uses Nginx for:

- Subdomain routing
- Rate limiting
- SSL termination
- Static file serving

### Docker Services

- **postgres**: Main PostgreSQL database
- **redis**: Caching and session storage
- **backend**: Node.js API server
- **nginx**: Reverse proxy and subdomain routing

## 📝 Development Notes

### Adding New Company Features

1. Add routes to `src/features/company/company.routes.ts`
2. Implement controller methods in `src/features/company/company.controller.ts`
3. Add business logic to `src/features/company/company.service.ts`
4. Use `getTenantDb()` for database operations

### Database Migrations

Each company gets its own database with the same schema. The `DatabaseService` handles:

- Dynamic database creation
- Schema migrations
- Connection management
- Cleanup on company deletion

### Security Considerations

- JWT tokens for authentication
- Rate limiting on API endpoints
- Input validation on all routes
- Database isolation per tenant
- Secure file upload handling

## 🚀 Production Deployment

1. Update environment variables for production
2. Configure SSL certificates in Nginx
3. Set up proper DNS for subdomains
4. Configure database backups
5. Set up monitoring and logging

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
