# Azerbaijan AI Platform - System Upgrade Guide

## Overview

This document outlines the complete system upgrade from an in-memory prototype to a production-ready application with persistent database, secure authentication, and role-based access control.

## Key Improvements

### 1. Database Layer (PostgreSQL + Prisma ORM)
- Persistent data storage using PostgreSQL
- Prisma ORM for type-safe database operations
- Automated migrations support
- Relationship management (users, students, links, results)

### 2. Authentication System
- JWT-based token authentication
- Access tokens (15 minutes) + Refresh tokens (7 days)
- Token storage in database for validation
- Secure password hashing with bcryptjs
- Token refresh mechanism

### 3. Route Protection & Middleware
- Next.js middleware for route protection
- Authorization header validation
- User context injection into requests
- Role-based access control (RBAC)

### 4. Role-Based Permissions
- Student: View own profile and results
- Parent: Manage linked students and view their results
- Teacher: Create tests, view class analytics
- Director: System administration, audit logs, school analytics

### 5. Audit & Logging
- Comprehensive audit trail of all actions
- User login/logout tracking
- Permission change logging
- API access logging
- Database-backed audit logs

### 6. API Security
- Standardized error responses
- Input validation with Zod
- Access control checks on all endpoints
- Permission verification before operations
- IP address and user agent tracking

## Setup Instructions

### Prerequisites
\`\`\`bash
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn package manager
\`\`\`

### Environment Variables

Create a `.env.local` file with:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/testai_az"

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET="your-long-random-secret-key-here"
JWT_REFRESH_SECRET="your-long-random-refresh-secret-key-here"

# AI Providers
XAI_API_KEY="xai-..."
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

### Installation

1. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

2. Set up Prisma:
\`\`\`bash
npx prisma generate
\`\`\`

3. Create database and run migrations:
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

4. Initialize sample data (optional):
\`\`\`bash
npx ts-node scripts/init-db.ts
\`\`\`

5. Start development server:
\`\`\`bash
npm run dev
\`\`\`

### Database Setup

The Prisma schema includes:

- **User**: Student/Parent/Teacher/Director accounts
- **Token**: JWT refresh tokens storage
- **ParentStudentLink**: Relationship between parents and students
- **TestResult**: Test completion records
- **Question**: Test questions and answers
- **AuditLog**: System activity tracking
- **PermissionLog**: Permission-based access logs

## API Endpoints

### Authentication

\`\`\`
POST /api/auth/register - Register new user
POST /api/auth/login - User login
PUT /api/auth/login - Refresh token
\`\`\`

### Student Management

\`\`\`
POST /api/students/link - Link student to parent
GET /api/students/link - Get linked students
DELETE /api/students/link?linkId=X - Unlink student
GET /api/students/results?studentId=X - Get student results
POST /api/students/results - Filter results by time range
\`\`\`

### Test Management

\`\`\`
POST /api/save-results - Save test results
GET /api/save-results - Get user's test results
POST /api/generate-test - Generate new test (AI-powered)
POST /api/analyze-test-results - Analyze performance
\`\`\`

### Admin Endpoints

\`\`\`
GET /api/admin/users - List all users (paginated)
PUT /api/admin/users - Update user status/role
GET /api/admin/audit-logs - View audit logs
GET /api/admin/analytics - School-wide analytics
\`\`\`

## Authentication Flow

### Registration
\`\`\`
1. User submits registration form
2. Validate input with Zod schema
3. Check email uniqueness
4. Hash password with bcryptjs
5. Create user in database
6. Generate JWT access + refresh tokens
7. Store refresh token in database
8. Return tokens and user data
\`\`\`

### Login
\`\`\`
1. User submits email/password
2. Find user in database
3. Compare passwords
4. Generate new tokens
5. Store refresh token
6. Log login action in audit trail
7. Update last login timestamp
8. Return tokens and user data
\`\`\`

### Protected Route Access
\`\`\`
1. Client includes Authorization: Bearer {token} header
2. Middleware extracts and verifies token
3. Token verified with JWT_SECRET
4. User context injected into request
5. Route handler checks permissions
6. Database queries executed
7. Results returned to client
\`\`\`

## Error Handling

All API responses follow a standard format:

### Success Response
\`\`\`json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field is required",
    "details": {...}
  }
}
\`\`\`

Error Codes:
- `UNAUTHORIZED` (401) - No authentication token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid input data
- `CONFLICT` (409) - Resource already exists
- `INTERNAL_ERROR` (500) - Server error

## Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Use HTTPS in production
3. **CORS**: Configure CORS policy appropriately
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **SQL Injection**: Prisma prevents SQL injection automatically
6. **XSS Protection**: Sanitize all user inputs
7. **Token Rotation**: Implement token rotation for long sessions
8. **Audit Logging**: All actions are logged for compliance

## Migration from In-Memory

### Data Migration Script

\`\`\`typescript
// scripts/migrate-from-memory.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function migrate() {
  // Load data from memory/files
  // Transform to new schema
  // Insert into PostgreSQL
  // Validate data integrity
  // Create audit records
}

migrate()
  .then(() => console.log("Migration complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect())
\`\`\`

## Testing

### Unit Tests
\`\`\`bash
npm run test
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

### E2E Tests
\`\`\`bash
npm run test:e2e
\`\`\`

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Enable PostgreSQL (using Vercel Postgres or external provider)
4. Deploy: `git push` to main branch

### Manual Deployment

1. Push code to production server
2. Install dependencies
3. Set environment variables
4. Run migrations: `npx prisma migrate deploy`
5. Start application: `npm run start`

## Monitoring & Maintenance

### Backups
- Automatic PostgreSQL backups
- Test restore procedures regularly
- Store backups in secure location

### Monitoring
- Monitor database performance
- Track error rates
- Watch for failed authentication attempts
- Monitor audit log for suspicious activity

### Updates
- Keep dependencies updated
- Security patches applied immediately
- Test updates in staging environment
- Plan maintenance windows

## Support & Troubleshooting

### Common Issues

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Verify network connectivity

**Token Validation Failed**
- Verify JWT_SECRET matches
- Check token hasn't expired
- Ensure Authorization header format is correct

**Permission Denied**
- Verify user role in database
- Check role has required permission
- Review audit logs for denied actions

## Next Steps

1. Deploy to staging environment
2. Run comprehensive security audit
3. Perform load testing
4. Train administrators on new system
5. Plan production migration
6. Set up monitoring and alerting
7. Document runbooks for support team

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Maintainer**: DevOps Team
