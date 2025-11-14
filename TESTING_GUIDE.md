# User Management Feature - Testing Guide

## Prerequisites

Before testing, ensure you have:
1. PostgreSQL database running with the schema migrated
2. Backend server running on port 4000
3. Frontend server running on port 3000
4. At least one ADMIN user in the database

## Environment Setup

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/salesmonitor
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Starting the Application

### Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing Scenarios

### 1. Access Control Testing

#### Scenario 1.1: ADMIN Access
1. Login with ADMIN credentials
2. Navigate to dashboard
3. ✅ Verify "Users" link appears in sidebar
4. Click "Users" link
5. ✅ Verify you can access /dashboard/users page

#### Scenario 1.2: Non-ADMIN Access
1. Login with GM or AM credentials
2. Navigate to dashboard
3. ✅ Verify "Users" link does NOT appear in sidebar
4. Try to access /dashboard/users directly (type URL)
5. ✅ Verify you are redirected to /dashboard

### 2. User Listing Testing

#### Scenario 2.1: View All Users
1. Login as ADMIN
2. Navigate to Users page
3. ✅ Verify table displays all users
4. ✅ Verify columns: User (name/email), Role, Department, Created, Actions
5. ✅ Verify user count statistics at bottom (Total, Admins, GMs, AMs)

#### Scenario 2.2: Search Users
1. On Users page, enter search term in search box
2. Try searching by:
   - User name (partial match)
   - Email address (partial match)
3. ✅ Verify table updates to show only matching users
4. Clear search
5. ✅ Verify all users appear again

#### Scenario 2.3: Filter by Role
1. On Users page, use role dropdown filter
2. Select "Admin"
3. ✅ Verify only ADMIN users are shown
4. Select "GM"
5. ✅ Verify only GM users are shown
6. Select "AM"
7. ✅ Verify only AM users are shown
8. Select "All Roles"
9. ✅ Verify all users appear

### 3. Create User Testing

#### Scenario 3.1: Create ADMIN User
1. Click "Create User" button
2. Fill form:
   - Email: test-admin@example.com
   - Name: Test Admin
   - Password: password123
   - Role: Admin
3. Click "Create User"
4. ✅ Verify success message
5. ✅ Verify new user appears in table
6. ✅ Verify user count incremented

#### Scenario 3.2: Create GM User
1. Click "Create User" button
2. Fill form:
   - Email: test-gm@example.com
   - Name: Test GM
   - Password: password123
   - Role: GM
   - Department: Select a department
3. Click "Create User"
4. ✅ Verify success and user created

#### Scenario 3.3: Create AM User
1. Click "Create User" button
2. Fill form:
   - Email: test-am@example.com
   - Name: Test AM
   - Password: password123
   - Role: AM
   - Department: Select a department
   - Manager: Select a manager
3. ✅ Verify Manager field appears for AM role
4. Click "Create User"
5. ✅ Verify success and user created

#### Scenario 3.4: Validation Testing
1. Click "Create User" button
2. Try to submit with:
   - Empty email → ✅ Verify error: "Email is required"
   - Invalid email → ✅ Verify error: "Email is invalid"
   - Empty name → ✅ Verify error: "Name is required"
   - Short name (1 char) → ✅ Verify error: "Name must be at least 2 characters"
   - Empty password → ✅ Verify error: "Password is required"
   - Short password (< 8 chars) → ✅ Verify error: "Password must be at least 8 characters"

#### Scenario 3.5: Duplicate Email
1. Try to create user with existing email
2. ✅ Verify error: "User with this email or username already exists"

### 4. Edit User Testing

#### Scenario 4.1: Edit User Details
1. Click "Edit" button on a user row
2. ✅ Verify modal opens with pre-filled data
3. ✅ Verify password field is NOT shown
4. Modify name
5. Click "Update User"
6. ✅ Verify success message
7. ✅ Verify changes reflected in table

#### Scenario 4.2: Change User Role
1. Edit a user
2. Change role from AM to GM
3. ✅ Verify manager field disappears
4. Save changes
5. ✅ Verify role updated in table

#### Scenario 4.3: Change Department
1. Edit a user
2. Change department
3. Save changes
4. ✅ Verify department updated in table

### 5. Password Reset Testing

#### Scenario 5.1: Reset Password
1. Click "Reset Password" button on a user row
2. ✅ Verify modal opens
3. Enter new password: newpassword123
4. Enter confirmation: newpassword123
5. Click "Reset Password"
6. ✅ Verify success message

#### Scenario 5.2: Password Validation
1. Click "Reset Password"
2. Try passwords:
   - Short password (< 8 chars) → ✅ Verify error
   - Mismatched passwords → ✅ Verify error: "Passwords do not match"

#### Scenario 5.3: Verify New Password Works
1. After resetting password
2. Logout
3. Try to login with the user's new password
4. ✅ Verify login successful

### 6. Delete User Testing

#### Scenario 6.1: Delete User
1. Click "Delete" button on a user row
2. ✅ Verify confirmation modal appears
3. ✅ Verify warning message shows user name
4. Click "Cancel"
5. ✅ Verify modal closes and user still exists
6. Click "Delete" again
7. Click "Delete" in modal
8. ✅ Verify success message
9. ✅ Verify user removed from table
10. ✅ Verify user count decremented

#### Scenario 6.2: Verify Soft Delete
1. Check database directly
2. ✅ Verify deleted user still exists in database
3. ✅ Verify deletedAt field is set to current timestamp
4. Try to login with deleted user
5. ✅ Verify login fails (user excluded by deletedAt filter)

### 7. API Endpoint Testing

You can test the backend API directly using curl or Postman:

#### Get All Users (ADMIN only)
```bash
curl -X GET http://localhost:4000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create User (ADMIN only)
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "password123",
    "role": "AM"
  }'
```

#### Update User (ADMIN only)
```bash
curl -X PUT http://localhost:4000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

#### Reset Password (ADMIN only)
```bash
curl -X POST http://localhost:4000/api/users/USER_ID/reset-password \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

#### Delete User (ADMIN only)
```bash
curl -X DELETE http://localhost:4000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### Get Departments
```bash
curl -X GET http://localhost:4000/api/users/departments \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### Get Managers
```bash
curl -X GET http://localhost:4000/api/users/managers \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 8. Security Testing

#### Scenario 8.1: Unauthorized Access
1. Try to access endpoints without authentication token
2. ✅ Verify 401 Unauthorized response

#### Scenario 8.2: Insufficient Permissions
1. Login as GM or AM user
2. Get authentication token
3. Try to call user management endpoints
4. ✅ Verify 403 Forbidden response

#### Scenario 8.3: Password Hashing
1. Create a user via API
2. Check database directly
3. ✅ Verify password field contains bcrypt hash (starts with $2a$ or $2b$)
4. ✅ Verify raw password is not stored

### 9. Mobile Responsive Testing

#### Scenario 9.1: Mobile Layout
1. Open browser DevTools
2. Switch to mobile viewport (e.g., iPhone 12)
3. Navigate to Users page
4. ✅ Verify table is scrollable horizontally
5. ✅ Verify all buttons are accessible
6. ✅ Verify modals are properly sized
7. ✅ Verify search and filters work

### 10. Edge Cases Testing

#### Scenario 10.1: Empty State
1. Delete all users except current ADMIN
2. ✅ Verify "No users found" message appears
3. ✅ Verify statistics show correct counts
4. ✅ Verify "Create User" button still works

#### Scenario 10.2: Special Characters
1. Create user with special characters in name
   - Name: "Test User (Admin)"
   - Email: "test+admin@example.com"
2. ✅ Verify user created successfully
3. ✅ Verify special characters displayed correctly

#### Scenario 10.3: Long Names
1. Create user with long name (50+ characters)
2. ✅ Verify name displays properly in table
3. ✅ Verify no layout breaking

#### Scenario 10.4: Multiple Rapid Requests
1. Quickly click "Create User" multiple times
2. ✅ Verify loading state prevents duplicate submissions
3. ✅ Verify only one user created

## Performance Testing

### Load Testing
1. Create 100+ users in database
2. Navigate to Users page
3. ✅ Verify page loads in reasonable time (< 3 seconds)
4. ✅ Verify search is responsive
5. ✅ Verify filters work smoothly

## Browser Compatibility

Test the feature on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Test Results Template

| Test Scenario | Expected Result | Actual Result | Status | Notes |
|---------------|----------------|---------------|--------|-------|
| ADMIN can access Users page | Page loads | | ☐ Pass / ☐ Fail | |
| Non-ADMIN redirected | Redirect to dashboard | | ☐ Pass / ☐ Fail | |
| Search by name | Filtered results | | ☐ Pass / ☐ Fail | |
| Filter by role | Role-specific users | | ☐ Pass / ☐ Fail | |
| Create ADMIN user | User created | | ☐ Pass / ☐ Fail | |
| Create GM user | User created | | ☐ Pass / ☐ Fail | |
| Create AM user | User created | | ☐ Pass / ☐ Fail | |
| Validation errors | Errors shown | | ☐ Pass / ☐ Fail | |
| Edit user | Changes saved | | ☐ Pass / ☐ Fail | |
| Reset password | Password updated | | ☐ Pass / ☐ Fail | |
| Delete user | Soft delete | | ☐ Pass / ☐ Fail | |
| API authorization | 403 for non-admin | | ☐ Pass / ☐ Fail | |
| Mobile responsive | UI works on mobile | | ☐ Pass / ☐ Fail | |

## Troubleshooting

### Issue: Users page not accessible
- **Solution**: Verify user has ADMIN role in database
- **Solution**: Check browser console for errors
- **Solution**: Verify backend is running and accessible

### Issue: "Network Error" on form submit
- **Solution**: Verify backend server is running
- **Solution**: Check CORS settings match frontend URL
- **Solution**: Verify authentication token is valid

### Issue: Password reset not working
- **Solution**: Verify new password meets 8-character requirement
- **Solution**: Check backend logs for validation errors
- **Solution**: Verify user exists and is not deleted

### Issue: Departments not loading in dropdown
- **Solution**: Verify departments exist in database
- **Solution**: Check backend /api/users/departments endpoint
- **Solution**: Verify authentication token is valid

## Automated Testing (Future)

Recommended automated tests to add:

### Unit Tests
- UserService methods
- Validation schemas
- Password hashing utilities
- React components

### Integration Tests
- API endpoint responses
- Authentication middleware
- Authorization checks
- Database operations

### E2E Tests
- Full user creation flow
- Edit and delete flows
- Password reset flow
- Search and filter functionality

## Reporting Issues

When reporting issues, include:
1. Test scenario being executed
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshots/screen recordings
6. Browser console logs
7. Network tab (for API errors)
8. Backend server logs

## Sign-off Checklist

Before considering testing complete:
- [ ] All test scenarios executed
- [ ] All validation tested
- [ ] Security testing completed
- [ ] Mobile responsive verified
- [ ] API endpoints tested directly
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Test results documented
- [ ] Issues reported (if any)
