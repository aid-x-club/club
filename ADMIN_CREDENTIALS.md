# Admin Dashboard Credentials

## Production Admin Account

**Email**: shubhamvasantgundu@gmail.com  
**Password**: (Use your existing account password)  
**Role**: Admin (Updated)  
**Access Level**: Full system access

**Note**: The account with email `shubhamvasantgundu@gmail.com` has been upgraded to admin role.

---

## Account Details

### Admin Privileges
- Full access to admin dashboard
- User management (create, edit, delete, role changes)
- Event management (create, edit, delete, view registrations)
- Project management (create, edit, delete, approve)
- Analytics and reporting access
- System settings configuration

### Access URL
- **Admin Dashboard**: `/admin/dashboard`
- **Login Page**: `/login`

---

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Change Default Password**: It's recommended to change the default password after first login
2. **Keep Credentials Secure**: Do not share admin credentials publicly
3. **Use Strong Passwords**: Consider using a password manager
4. **Enable 2FA**: If available, enable two-factor authentication
5. **Regular Password Updates**: Change passwords periodically
6. **Monitor Activity**: Review admin activity logs regularly

---

## Login Instructions

**IMPORTANT: You must start BOTH servers before logging in!**

### Step 1: Start the Backend Server
Open a terminal and run:
```bash
cd backend
npm run dev
```
Wait until you see: "✅ MongoDB connected successfully" and "Server running on port 5000"

### Step 2: Start the Frontend Server (if not already running)
Open another terminal and run:
```bash
npm run dev
```

### Step 3: Login
1. Navigate to the login page: `http://localhost:5173/login`
2. Enter email: `shubhamvasantgundu@gmail.com`
3. Enter your existing account password
4. Click "Sign In"
5. You will be automatically redirected to: `http://localhost:5173/admin/dashboard`

---

## Development/Testing Accounts

For development and testing purposes, the following test accounts are available:

### Test Coordinator Account
- **Email**: coordinator@test.com
- **Password**: test123
- **Role**: Coordinator
- **Purpose**: Testing coordinator-level features
- **Access**: Can create/manage events and projects, limited admin access

### Test Student Account
- **Email**: student@test.com
- **Password**: test123
- **Role**: Student
- **Purpose**: Testing student-level features
- **Access**: Can view events, register for events, submit projects

**Note**: Use the email addresses (not usernames) to login.

---

## Role Permissions

### Admin
- ✅ Full dashboard access
- ✅ User management
- ✅ Event CRUD operations
- ✅ Project CRUD operations
- ✅ Analytics access
- ✅ Settings configuration
- ✅ Role assignment

### Coordinator
- ✅ Dashboard access (limited)
- ✅ Event creation and management
- ✅ Project creation and management
- ✅ View analytics
- ❌ User role changes
- ❌ System settings

### Student
- ❌ No admin dashboard access
- ✅ View events
- ✅ Register for events
- ✅ Submit projects
- ✅ View own profile

---

## Troubleshooting

### Cannot Login
- Verify username and password are correct
- Check if account exists in database
- Ensure backend server is running
- Check browser console for errors

### Access Denied to Admin Dashboard
- Verify user role is "admin" or "coordinator"
- Check authentication token is valid
- Try logging out and logging back in
- Clear browser cache and cookies

### Forgot Password
- Use the "Forgot Password" link on login page
- Follow email instructions to reset password
- Contact system administrator if needed

---

## Backend Setup

If you need to create the admin user in the database manually:

```javascript
// MongoDB document example
{
  "fullName": "Shubham Gundu",
  "email": "shubhamvasantgundu@gmail.com",
  "studentId": "ADMIN001",
  "role": "admin",
  "username": "shubsss",
  "password": "<hashed_password>", // Hash: shubsss.dev
  "profileImage": "/images/s/club_logo.png",
  "createdAt": ISODate("2025-01-01T00:00:00Z"),
  "isVerified": true
}
```

---

## Contact

For admin access issues or password resets:
- **Email**: shubhamvasantgundu@gmail.com
- **Role**: Lead Administrator
- **Organization**: AID-X Club

---

**Last Updated**: December 16, 2025  
**Document Version**: 1.0  
**Confidentiality**: RESTRICTED - Admin Use Only
