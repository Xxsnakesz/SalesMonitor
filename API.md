# API Documentation

## Base URL

- Development: `http://localhost:4000/api`
- Production: `https://yourdomain.com/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication via JWT token.

### Token Storage
Tokens are stored in httpOnly cookies:
- `accessToken`: Valid for 1 hour
- `refreshToken`: Valid for 7 days

### Headers
```
Cookie: accessToken=<token>; refreshToken=<token>
```

Or use Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user (Admin only for creating users).

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "role": "AM", // ADMIN | GM | AM
  "departmentId": "uuid" // Optional
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "AM",
    "departmentId": "uuid"
  }
}
```

#### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "AM",
    "department": {
      "id": "uuid",
      "name": "Sales Department"
    }
  }
}
```

**Note:** Sets `accessToken` and `refreshToken` cookies.

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "token" // Optional if sent via cookie
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_access_token"
}
```

#### POST /auth/logout
Logout user and invalidate refresh token.

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current authenticated user details.

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "AM",
    "departmentId": "uuid",
    "department": {
      "id": "uuid",
      "name": "Sales Department"
    }
  }
}
```

---

### Users (Admin Only)

#### GET /users
List all users.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `role` (enum: ADMIN, GM, AM)
- `departmentId` (uuid)

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "AM",
      "department": {
        "id": "uuid",
        "name": "Sales Department"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### GET /users/:id
Get user by ID.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "AM",
  "departmentId": "uuid",
  "department": {
    "id": "uuid",
    "name": "Sales Department"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### POST /users
Create a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "password": "securePassword123",
  "role": "AM",
  "departmentId": "uuid" // Optional
}
```

**Response:** `201 Created`

#### PUT /users/:id
Update user details.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "updated@example.com",
  "role": "GM",
  "departmentId": "uuid"
}
```

**Response:** `200 OK`

#### DELETE /users/:id
Soft delete a user.

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

### Targets

#### GET /targets
List targets (filtered by user role).

**Query Parameters:**
- `month` (number, 1-12)
- `year` (number)
- `userId` (uuid, GM/Admin only)
- `departmentId` (uuid, Admin only)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "amount": 100000000,
    "currency": "IDR",
    "month": 11,
    "year": 2024,
    "userId": "uuid",
    "departmentId": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    }
  }
]
```

#### POST /targets
Create or update a target (Admin/GM only).

**Request Body:**
```json
{
  "amount": 100000000,
  "currency": "IDR",
  "month": 11,
  "year": 2024,
  "userId": "uuid", // Optional: for AM targets
  "departmentId": "uuid" // Optional: for department targets
}
```

**Response:** `201 Created`

#### DELETE /targets/:id
Delete a target (Admin only).

**Response:** `200 OK`

---

### Customers

#### GET /customers
List customers (filtered by user role).

**Query Parameters:**
- `status` (enum: prospect, ongoing, proposal, negotiation, closed-won, closed-lost)
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "customers": [
    {
      "id": "uuid",
      "companyName": "ABC Corp",
      "pic": "John Doe",
      "phone": "+1234567890",
      "email": "contact@abc.com",
      "potential": 50000000,
      "timeline": "2024-12-31T00:00:00Z",
      "status": "proposal",
      "am": {
        "id": "uuid",
        "name": "Jane Smith"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### GET /customers/:id
Get customer details with progress history.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "companyName": "ABC Corp",
  "pic": "John Doe",
  "phone": "+1234567890",
  "email": "contact@abc.com",
  "potential": 50000000,
  "timeline": "2024-12-31T00:00:00Z",
  "status": "proposal",
  "am": {
    "id": "uuid",
    "name": "Jane Smith"
  },
  "progresses": [
    {
      "id": "uuid",
      "date": "2024-11-01T00:00:00Z",
      "description": "Initial meeting completed",
      "status": "ongoing"
    }
  ]
}
```

#### POST /customers
Create a new customer.

**Request Body:**
```json
{
  "amId": "uuid", // Required for GM/Admin, auto-set for AM
  "companyName": "XYZ Inc",
  "pic": "Jane Doe",
  "phone": "+1234567890",
  "email": "jane@xyz.com", // Optional
  "potential": 75000000,
  "timeline": "2024-12-31", // Optional
  "status": "prospect"
}
```

**Response:** `201 Created`

#### PUT /customers/:id
Update customer details.

**Request Body:**
```json
{
  "companyName": "XYZ Corp Updated",
  "pic": "Jane Doe",
  "phone": "+1234567890",
  "email": "updated@xyz.com",
  "potential": 80000000,
  "timeline": "2025-01-31",
  "status": "ongoing"
}
```

**Response:** `200 OK`

#### DELETE /customers/:id
Soft delete a customer.

**Response:** `200 OK`

---

### Progress

#### POST /progress
Log a progress entry for a customer.

**Request Body:**
```json
{
  "customerId": "uuid",
  "description": "Follow-up call completed. Client interested in proposal.",
  "status": "proposal",
  "date": "2024-11-14T10:30:00Z" // Optional, defaults to now
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "amId": "uuid",
  "description": "Follow-up call completed. Client interested in proposal.",
  "status": "proposal",
  "date": "2024-11-14T10:30:00Z",
  "createdAt": "2024-11-14T10:30:00Z"
}
```

---

### Dashboard

#### GET /dashboard/stats
Get dashboard statistics (role-specific).

**Query Parameters:**
- `month` (number, 1-12, optional)
- `year` (number, optional)

**Response:** `200 OK`

**For AM:**
```json
{
  "targetAmount": 100000000,
  "actualAmount": 45000000,
  "pipelineValue": 150000000,
  "activeCustomers": 12,
  "customersByStatus": [
    {
      "status": "prospect",
      "count": 3,
      "value": 30000000
    },
    {
      "status": "proposal",
      "count": 5,
      "value": 70000000
    }
  ],
  "needsFollowUp": [
    {
      "id": "uuid",
      "companyName": "ABC Corp",
      "potential": 20000000
    }
  ],
  "recentProgress": [
    {
      "id": "uuid",
      "customer": {
        "companyName": "XYZ Inc"
      },
      "description": "Meeting scheduled",
      "date": "2024-11-14T00:00:00Z"
    }
  ]
}
```

**For GM (includes all AMs in department):**
```json
{
  "departmentTarget": 500000000,
  "departmentActual": 250000000,
  "amPerformance": [
    {
      "amId": "uuid",
      "amName": "John Doe",
      "target": 100000000,
      "actual": 50000000,
      "achievement": 50
    }
  ],
  "topPerformers": [...],
  "overallStats": {...}
}
```

**For Admin (company-wide):**
```json
{
  "companyTarget": 2000000000,
  "companyActual": 1200000000,
  "departmentBreakdown": [
    {
      "departmentId": "uuid",
      "departmentName": "Sales Dept A",
      "target": 500000000,
      "actual": 300000000
    }
  ],
  "monthlyTrend": [...],
  "topDepartments": [...]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (authentication required) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found |
| 405  | Method Not Allowed |
| 429  | Too Many Requests (rate limit exceeded) |
| 500  | Internal Server Error |
| 501  | Not Implemented |

## Rate Limiting

- **API Routes**: 100 requests per 15 minutes per IP
- **General Routes**: 30 requests per second per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1699999999
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:4000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Client → Server
- `ping` - Keep-alive check

#### Server → Client
- `target:updated` - Target was created/updated
- `customer:created` - New customer added
- `customer:updated` - Customer updated
- `progress:created` - New progress entry
- `notification` - General notification

**Event Payload Example:**
```json
{
  "type": "customer:created",
  "data": {
    "id": "uuid",
    "companyName": "New Company",
    "amId": "uuid"
  }
}
```

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1, min: 1)
- `limit` (default: 20, min: 1, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

## Testing

Use tools like:
- **Postman** - Import collection (create from this doc)
- **curl** - Command-line testing
- **httpie** - User-friendly CLI HTTP client

### Example curl Request
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user (using cookies)
curl -X GET http://localhost:4000/api/auth/me \
  -b cookies.txt
```

## Environment Variables

See `.env.example` files for configuration options.
