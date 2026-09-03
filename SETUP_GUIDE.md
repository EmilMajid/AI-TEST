# Quick Start Guide

## Installation Steps

### 1. Clone and Install
\`\`\`bash
git clone <repository>
cd testai-az
npm install
\`\`\`

### 2. Database Setup

Create `.env.local`:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/testai_az"
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
XAI_API_KEY="xai-your-key-here"
\`\`\`

### 3. Initialize Prisma
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 4. Start Development
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## API Usage Examples

### Register
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "student",
    "firstName": "Ayşe",
    "lastName": "Hüseynova",
    "fatherName": "Hüseyn",
    "region": "Bakı",
    "school": "Şəhid Gözəl Qızlı Məktəb",
    "class": "10",
    "email": "ayse@example.com",
    "password": "Test1234",
    "confirmPassword": "Test1234"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ayse@example.com",
    "password": "Test1234"
  }'
\`\`\`

### Protected Request
\`\`\`bash
curl -X GET http://localhost:3000/api/save-results \
  -H "Authorization: Bearer {accessToken}"
\`\`\`

## Database Inspection

\`\`\`bash
# Open Prisma Studio
npx prisma studio

# Run Prisma CLI
npx prisma db push
npx prisma db pull
\`\`\`

## Documentation

- [System Upgrade Guide](./SYSTEM_UPGRADE.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Guide](https://nextjs.org/docs)
