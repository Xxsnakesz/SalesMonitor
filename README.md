# Sales Monitor - Full-Stack Web Application

A production-ready, scalable full-stack web application for monitoring sales targets and progress with role-based access control, real-time updates, and comprehensive analytics.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control (RBAC)**
  - Admin: Full system access, user management, company-wide analytics
  - GM (General Manager): Department oversight, target setting for AMs
  - AM (Area Manager): Personal sales tracking, customer management

- **Real-Time Updates**
  - WebSocket integration with Socket.io
  - Live dashboard updates
  - Instant notifications

- **Sales Management**
  - Customer tracking and pipeline management
  - Progress logging with attachments
  - Target setting and monitoring
  - Performance analytics

- **Dashboard & Analytics**
  - Role-specific dashboards
  - Interactive charts (Recharts)
  - KPI tracking
  - Export capabilities

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Real-time**: Socket.io Client

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate Limiting

#### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL 16

### Monorepo Structure
```
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── pages/         # Pages Router
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── styles/        # Global styles
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
├── backend/               # Express API
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middlewares/  # Express middleware
│   │   ├── socket/       # WebSocket handlers
│   │   ├── utils/        # Utilities
│   │   └── types/        # TypeScript types
│   └── prisma/           # Database schema & migrations
│
├── docker/               # Docker configuration
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml    # Development setup
```

## 📋 Prerequisites

- Node.js 20+ 
- Docker & Docker Compose
- PostgreSQL 16 (for local development without Docker)

## 🛠️ Installation

### Local Development (without Docker)

1. **Clone the repository**
```bash
git clone https://github.com/Xxsnakesz/SalesMonitor.git
cd SalesMonitor
```

2. **Install root dependencies**
```bash
npm install
```

3. **Set up backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

4. **Set up frontend**
```bash
cd ../frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your API URL
```

5. **Start development servers**

From the root directory:
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:backend    # Backend on port 4000
npm run dev:frontend   # Frontend on port 3000
```

### Docker Development

1. **Clone and configure**
```bash
git clone https://github.com/Xxsnakesz/SalesMonitor.git
cd SalesMonitor
```

2. **Start with Docker Compose**
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

3. **Run migrations**
```bash
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Health: http://localhost:4000/health

## 🚢 Production Deployment

### Using Docker Compose (VPS)

1. **Prepare the server**
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

2. **Clone the repository**
```bash
git clone https://github.com/Xxsnakesz/SalesMonitor.git
cd SalesMonitor
```

3. **Configure environment variables**
```bash
# Create .env file in the root directory
cp backend/.env.example .env

# Edit .env with production values
nano .env
```

Required environment variables:
```env
# Database
POSTGRES_DB=salesmonitor
POSTGRES_USER=salesmonitor
POSTGRES_PASSWORD=your-strong-password-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# URLs
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_WS_URL=https://yourdomain.com

# Ports
PORT=80
SSL_PORT=443
```

4. **Build and start**
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

5. **Run migrations**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:seed
```

6. **Configure reverse proxy (if using domain)**

Update `docker/nginx.conf` with your domain and SSL certificates.

### SSL/HTTPS Setup

For production, it's recommended to use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Certbot will automatically configure Nginx
```

## 🗄️ Database Schema

### Core Models
- **User**: User accounts with roles (ADMIN, GM, AM)
- **Department**: Organizational units with GMs
- **Target**: Sales targets (monthly/quarterly/yearly)
- **Customer**: Customer records with sales pipeline
- **Progress**: Customer interaction tracking
- **Session**: JWT refresh token storage
- **Notification**: User notifications
- **ActivityLog**: Audit trail

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/logout       - Logout
GET    /api/auth/me           - Get current user
```

### Users (Admin only)
```
GET    /api/users             - List all users
GET    /api/users/:id         - Get user details
POST   /api/users             - Create user
PUT    /api/users/:id         - Update user
DELETE /api/users/:id         - Delete user
```

### Targets
```
GET    /api/targets           - List targets (role-filtered)
POST   /api/targets           - Create/update target (Admin/GM)
DELETE /api/targets/:id       - Delete target (Admin)
```

### Customers
```
GET    /api/customers         - List customers (role-filtered)
GET    /api/customers/:id     - Get customer details
POST   /api/customers         - Create customer
PUT    /api/customers/:id     - Update customer
DELETE /api/customers/:id     - Delete customer
```

### Progress
```
POST   /api/progress          - Log progress entry
```

### Dashboard
```
GET    /api/dashboard/stats   - Get dashboard statistics
```

## 🔧 Configuration

### Backend Environment Variables

See `backend/.env.example` for all available options.

Key configurations:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for access tokens
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `CORS_ORIGIN`: Allowed origin for CORS
- `PORT`: Backend server port (default: 4000)

### Frontend Environment Variables

See `frontend/.env.example` for all available options.

Key configurations:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WS_URL`: WebSocket URL

## 🐛 Troubleshooting

### Common Issues

**1. Database connection errors**
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

**2. Port already in use**
```bash
# Change ports in docker-compose.yml or .env file
# Default ports: 3000 (frontend), 4000 (backend), 5432 (postgres)
```

**3. Prisma client not generated**
```bash
cd backend
npm run prisma:generate
```

**4. Frontend can't connect to backend**
- Check `NEXT_PUBLIC_API_URL` in frontend/.env.local
- Ensure backend is running on the specified port
- Check CORS configuration in backend

**5. WebSocket connection issues**
- Verify `NEXT_PUBLIC_WS_URL` matches backend URL
- Check nginx.conf for WebSocket proxy configuration
- Ensure Socket.io is properly initialized

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🔒 Security

### Implemented Security Measures
- JWT authentication with refresh tokens
- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies for tokens
- CORS protection
- Helmet.js security headers
- Rate limiting on API endpoints
- SQL injection prevention (Prisma ORM)
- XSS protection
- Input validation (Zod)

### Production Security Checklist
- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Review and restrict CORS origins
- [ ] Implement rate limiting
- [ ] Keep dependencies updated

## 📊 Performance

### Optimization Features
- Next.js standalone output for minimal Docker image
- Multi-stage Docker builds
- Gzip compression (Nginx)
- Static asset caching
- Database query optimization with Prisma
- Connection pooling

### Monitoring
- Health check endpoints
- Request logging (Winston)
- Database query logging (development)

## 👥 User Roles

### Admin
- Full system access
- User management (CRUD)
- Company-wide analytics
- Export reports

### GM (General Manager)
- View all AMs in department
- Set targets for AMs
- View consolidated department performance
- Receive notifications

### AM (Area Manager)
- View personal targets
- Manage customers
- Log sales progress
- View personal dashboard

## 🤝 Contributing

This is a private project. For contributions, please contact the repository owner.

## 📝 License

Private - All rights reserved

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Full-stack monorepo architecture
- Role-based access control
- Real-time updates with WebSocket
- Docker deployment support
- PostgreSQL with Prisma ORM
- Comprehensive API
- Responsive dashboard

## 🗺️ Roadmap

Future enhancements may include:
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced reporting (PDF/CSV export)
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics & forecasting
- [ ] Integration with CRM systems
- [ ] Automated backup system
- [ ] Performance monitoring dashboard
