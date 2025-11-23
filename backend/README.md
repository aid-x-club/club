# AID-X Club Portal - Backend API

Backend server for the AID-X Club Portal built with Node.js, Express, and MongoDB.

## 📁 Project Structure

```
backend/
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
├── models/              # MongoDB schemas
├── routes/              # API routes
├── utils/               # Utility functions
├── server.js            # Server entry point
├── package.json         # Dependencies
├── .env.example         # Environment template
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT (min 32 characters)
   - `FRONTEND_URL` - Your frontend URL (for CORS)

5. **Start the server:**

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/verify-id` - Verify student ID
- `POST /api/auth/signup` - Register new student
- `POST /api/auth/login` - Login student
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get public profile
- `POST /api/users/github/connect` - Connect GitHub
- `POST /api/users/github/disconnect` - Disconnect GitHub

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📝 Request Examples

### Verify Student ID
```bash
POST /api/auth/verify-id
Content-Type: application/json

{
  "studentId": "ABC123"
}
```

### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "studentId": "ABC123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "year": "2nd",
  "section": "A"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## 🔧 Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# GitHub (optional)
GITHUB_TOKEN=your_github_token
GITHUB_ORG=AI-Data-Excellence-Club
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- Request validation with express-validator
- CORS protection
- Helmet.js security headers
- MongoDB injection prevention

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers

## 🔄 Phase 1 Completed

✅ User model with authentication
✅ JWT-based auth system
✅ Signup flow with student ID verification
✅ Login with email & password
✅ User profile management
✅ GitHub integration structure
✅ Role-based middleware
✅ Comprehensive error handling
✅ Request validation
✅ API documentation

## 📋 Next Phases

**Phase 2:** Project Management
**Phase 3:** Event Management
**Phase 4:** Admin Portal
**Phase 5:** Coordinator Features
**Phase 6:** Advanced Features

## 🤝 Contributing

For contributions, follow the existing code structure and add tests for new features.

## 📄 License

CC-BY-NC-4.0

---

**Built with ❤️ for AID-X Club**
