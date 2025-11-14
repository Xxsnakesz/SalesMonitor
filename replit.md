# Sales Target & Progress Monitoring System

## Overview

A full-stack web application for monitoring sales targets, customers, and progress tracking with role-based access control. Built with Next.js, TypeScript, PostgreSQL (via Prisma), and deployed on Replit.

**Status**: ✅ Fully functional MVP
**Last Updated**: November 14, 2025

## Purpose & Goals

- Track sales targets and actual performance at department and individual AM levels
- Manage customer pipeline with status tracking (prospect → closed-won/lost)
- Monitor progress and follow-up activities for each customer
- Provide role-specific dashboards for ADMIN, GM (General Manager), and AM (Account Manager)
- Visualize sales funnel, targets vs actuals, and pipeline value with interactive charts

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom theme
- **State Management**: React Query (TanStack Query) for server state
- **Charts**: Recharts (bar charts, donut charts)
- **Date Handling**: date-fns

### Backend
- **API**: Next.js API Routes (`/api/v1/*`)
- **Database**: PostgreSQL (Neon-hosted) via DATABASE_URL
- **ORM**: Prisma
- **Authentication**: JWT tokens stored in httpOnly cookies
- **Password Hashing**: bcrypt (12 rounds)
- **Validation**: Zod schemas

### Development
- **Port**: 5000 (configured for Replit webview)
- **Package Manager**: npm
- **Node Version**: Node.js 20

## Project Architecture

### Database Schema
```
- User (ADMIN, GM, AM roles)
- Department (linked to GM)
- Target (monthly targets for departments/users)
- Customer (company info, potential value, status tracking)
- Progress (activity logs for customers)
- Attachment (file metadata for future uploads)
- ActivityLog (audit trail for user actions)
```

### Directory Structure
```
/
├── src/
│   ├── pages/                    # Next.js pages & API routes
│   │   ├── index.tsx            # Landing page (redirects to dashboard/login)
│   │   ├── auth/login.tsx       # Login page
│   │   ├── dashboard/           # Dashboard pages
│   │   │   ├── index.tsx        # Main dashboard
│   │   │   ├── customers.tsx    # Customer management
│   │   │   └── targets.tsx      # Target management
│   │   └── api/v1/              # API routes
│   │       ├── auth/            # Authentication endpoints
│   │       ├── customers/       # Customer CRUD
│   │       ├── targets/         # Target management
│   │       ├── progress/        # Progress tracking
│   │       └── reports/         # Dashboard stats
│   ├── components/
│   │   ├── layout/              # Layout components (DashboardLayout)
│   │   ├── dashboard/           # Dashboard UI components (StatCard)
│   │   ├── charts/              # Chart components (BarChart, DonutChart)
│   │   └── forms/               # Form components (CustomerForm)
│   ├── hooks/                   # React Query hooks for data fetching
│   ├── lib/                     # Utilities
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth/               # Auth utilities (tokens, hash, currentUser)
│   │   ├── rbac/               # Permission checks
│   │   └── api-client.ts       # API wrapper with auth
│   ├── server/                  # Backend logic
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic
│   │   ├── validation/         # Zod schemas
│   │   └── middlewares/        # Auth & role middlewares
│   ├── types/                   # TypeScript type definitions
│   └── styles/                  # Global CSS
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Demo data seeding script
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## User Roles & Permissions

### ADMIN
- Full access to all data
- View all departments, targets, customers, and progress
- Set targets for any department or user

### GM (General Manager)
- View all data within their department
- View and manage AMs in their department
- Set department-level targets
- View customers and progress for all AMs in their department

### AM (Account Manager)
- View only their own customers and progress
- Create and manage their own customers
- Add progress notes to their customers
- View their personal targets

## Key Features Implemented

### ✅ Authentication System
- JWT-based auth with httpOnly cookies (access token + refresh token)
- Secure password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Middleware for protected routes

### ✅ Dashboard (Role-Specific)
**AM Dashboard:**
- Target vs Actual card with bar chart
- Pipeline total value card
- Customer funnel donut chart (by status)
- "Customers needing follow-up" table (no activity in 7+ days)
- Recent progress timeline

**GM Dashboard:**
- Department-level metrics
- Overview of all AMs in department
- Aggregated targets and actuals

**ADMIN Dashboard:**
- System-wide overview
- All departments, targets, customers

### ✅ Customer Management
- CRUD operations for customers
- Status tracking: prospect → ongoing → proposal → negotiation → closed-won/closed-lost
- Filter by status
- Pagination support
- Potential value tracking (in IDR)
- Timeline/deadline tracking
- Company name, PIC (Person in Charge), phone, email

### ✅ Target Management
- Monthly/yearly target setting
- Department-level and user-level targets
- Target vs actual comparison
- Currency: IDR (Indonesian Rupiah)

### ✅ Progress Tracking
- Add progress notes to customers
- Track activity dates
- View recent activity timeline
- Automatic follow-up reminders

### ✅ Data Visualization
- Bar charts for target vs actual
- Donut charts for customer funnel by status
- Interactive tooltips and legends
- Responsive design

## Demo Users

The database is pre-seeded with demo data for testing:

```
ADMIN:
  Email: admin@example.com
  Password: password123

GM (General Manager 1):
  Email: gm1@example.com
  Password: password123

AM (Account Manager 1):
  Email: am1@example.com
  Password: password123
```

## Environment Variables

Required secrets (managed via Replit Secrets):
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `SESSION_SECRET`: JWT signing key (auto-configured)
  - **CRITICAL**: Must be set before application starts - the app will throw an error if missing
  - Use a strong, cryptographically random string (minimum 32 characters)
  - Never use default or weak values in production
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Postgres credentials (auto-configured)

## Deployment Requirements

### Security Checklist
Before deploying to production, ensure:

1. **SESSION_SECRET Environment Variable**
   - Must be set to a strong, unique random string
   - Minimum 32 characters recommended
   - Generate using: `openssl rand -base64 32` or similar
   - Never commit this value to version control

2. **Database Configuration**
   - DATABASE_URL points to production database
   - Database has proper backups configured
   - Connection pooling is enabled for production load

3. **RBAC Validation**
   - Test that AMs can only access their own data
   - Test that GMs can only access their department data
   - Test that ADMINs have full access
   - Verify deleted users cannot authenticate

4. **Production Settings**
   - Set NODE_ENV=production
   - Ensure secure cookies (httpOnly, secure flags)
   - Review CORS settings if applicable

## Running the Application

### Development
```bash
npm run dev
```
Starts Next.js dev server on port 5000

### Database Operations
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with demo data
npm run prisma:seed
```

### Build for Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with email/password
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout (clear cookies)

### Customers
- `GET /api/v1/customers` - List customers (with filters, pagination)
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers/:id` - Get customer by ID
- `PUT /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Soft delete customer

### Targets
- `GET /api/v1/targets` - List targets (filtered by role)
- `POST /api/v1/targets` - Create/update target (GM/ADMIN only)

### Progress
- `GET /api/v1/progress` - List progress (by customer or AM)
- `POST /api/v1/progress` - Add progress note

### Reports
- `GET /api/v1/reports/dashboard` - Get dashboard statistics

## Recent Changes

### November 14, 2025
- Initial project setup with Next.js 14 + TypeScript
- Implemented complete Prisma schema with all models
- Built authentication system with JWT and bcrypt
- Created repository/service layer architecture
- Implemented all API routes with RBAC
- Built responsive UI with TailwindCSS
- Created role-specific dashboards with Recharts
- Implemented customer management with CRUD operations
- Added target management and progress tracking
- Seeded database with realistic demo data
- Configured Replit workflow for port 5000

## Future Enhancements (Not in MVP)

1. **File Uploads**
   - Implement attachment uploads for progress notes
   - Add virus scanning (ClamAV) for uploaded files
   - File preview and download functionality

2. **Advanced Reporting**
   - Excel/PDF export for reports
   - Custom date range filtering
   - Advanced analytics and forecasting

3. **Notifications**
   - Email/SMS reminders for follow-ups
   - Target milestone alerts
   - Real-time notifications

4. **Activity Logging Dashboard**
   - Complete audit trail UI
   - User action history
   - Search and filter capabilities

5. **Enhanced Search**
   - Full-text search across customers
   - Advanced multi-field filtering
   - Saved search filters

6. **Token Refresh**
   - Automatic access token rotation
   - Refresh token revocation
   - Session management UI

## Code Conventions

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with TypeScript interfaces
- **API Routes**: Consistent error handling with handleApiError middleware
- **Database**: All queries go through repository layer
- **Business Logic**: Isolated in service layer
- **Validation**: Zod schemas for all user inputs
- **Security**: No secrets in code, httpOnly cookies, RBAC on all routes
- **Styling**: TailwindCSS utility classes, custom theme in tailwind.config.js

## Known Issues

- LSP diagnostics show unused parameter warnings (cosmetic, doesn't affect functionality)
- server/db.ts file from integration (not used, can be ignored)

## Performance Notes

- React Query caching reduces unnecessary API calls
- Database queries use indexes for performance
- Pagination implemented on customer listing
- Skeleton loaders during data fetch

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens in httpOnly cookies (prevents XSS)
- RBAC enforced at API level
- SQL injection prevented via Prisma ORM
- Input validation with Zod
- No client-side secret exposure
