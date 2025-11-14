# User Management Feature

## Overview
This feature provides a comprehensive user management interface for ADMIN users to manage system users.

## Features

### Backend API Endpoints
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/departments` - Get all departments
- `GET /api/users/managers` - Get all managers (ADMIN and GM users)
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user
- `POST /api/users/:id/reset-password` - Reset user password

### Frontend UI
- User listing page at `/dashboard/users`
- Search users by name or email
- Filter users by role (ADMIN, GM, AM)
- Create new users with role assignment
- Edit existing users
- Delete users with confirmation
- Reset user passwords
- Department and manager assignment
- Statistics dashboard showing user counts by role

## Security
- All endpoints require ADMIN role authentication
- Passwords must be at least 8 characters
- Passwords are hashed using bcryptjs with 10 rounds
- Soft delete implementation (users are marked as deleted, not removed)
- Email and username uniqueness validation

## Usage

### Creating a User
1. Navigate to Users page (visible only to ADMIN)
2. Click "Create User" button
3. Fill in user details:
   - Email (required)
   - Name (required)
   - Username (optional)
   - Password (required, min 8 chars)
   - Role (ADMIN/GM/AM)
   - Department (optional)
   - Manager (optional, for AM role)
4. Submit form

### Editing a User
1. Click "Edit" button on user row
2. Modify user details (password change not required)
3. Submit form

### Resetting Password
1. Click "Reset Password" button on user row
2. Enter new password (min 8 chars)
3. Confirm password
4. Submit form

### Deleting a User
1. Click "Delete" button on user row
2. Confirm deletion in modal
3. User is soft deleted (deletedAt timestamp set)

## Technical Details

### Backend Stack
- Express.js REST API
- Prisma ORM with PostgreSQL
- JWT authentication
- bcryptjs for password hashing
- Zod for validation

### Frontend Stack
- React with Next.js
- TanStack Query (React Query) for data fetching
- TypeScript for type safety
- Tailwind CSS for styling

## Code Structure

### Backend
- `backend/src/services/user.service.ts` - User business logic
- `backend/src/routes/user.routes.ts` - API route definitions
- `backend/src/types/index.ts` - Validation schemas

### Frontend
- `frontend/src/pages/dashboard/users.tsx` - User management page
- `frontend/src/components/forms/UserFormModal.tsx` - Create/Edit form
- `frontend/src/components/forms/DeleteConfirmModal.tsx` - Delete confirmation
- `frontend/src/components/forms/ResetPasswordModal.tsx` - Password reset form
- `frontend/src/hooks/useUsers.ts` - Data fetching hooks
- `frontend/src/components/layout/DashboardLayout.tsx` - Updated navigation

## Security Considerations

### Implemented
- ✅ Role-based access control (ADMIN only)
- ✅ Password hashing with bcryptjs
- ✅ Input validation with Zod
- ✅ Soft delete for data retention
- ✅ Email/username uniqueness checks
- ✅ JWT authentication on all endpoints

### Future Enhancements
- Add CSRF protection for cookie-based authentication
- Implement rate limiting for password reset
- Add audit logging for user changes
- Add email verification for new users
- Add two-factor authentication option
