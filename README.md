# Chicify - Next.js E-commerce Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm/yarn/pnpm/bun

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chicify
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chicify

# Environment
NODE_ENV=development
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`

Registers a new user with enhanced validation and logging.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "Kayıt başarılı",
  "details": "Hesabınız başarıyla oluşturuldu"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message",
  "details": "Detailed error description",
  "code": "ERROR_CODE"
}
```

**Error Codes:**
- `INVALID_JSON` - Invalid JSON format
- `VALIDATION_ERROR` - Input validation failed
- `USER_EXISTS` - User already registered
- `CONFIG_ERROR` - Server configuration error
- `DB_CONNECTION_ERROR` - Database connection failed
- `DB_QUERY_ERROR` - Database query error
- `HASH_ERROR` - Password hashing failed
- `DB_INSERT_ERROR` - Database insertion failed
- `INTERNAL_ERROR` - Unexpected server error

## Debugging & Logging

### Log Levels

The application uses structured logging with different levels:

- **DEBUG**: Detailed information for debugging (development only)
- **INFO**: General information about application flow
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages with stack traces

### Log Format

```
[LEVEL] TIMESTAMP - MESSAGE [DATA]
```

Example:
```
[INFO] 2024-01-15T10:30:45.123Z - Registration request started { requestId: "abc-123-def" }
```

### Debugging Features

1. **Request ID Tracking**: Each request gets a unique ID for tracing
2. **Comprehensive Error Handling**: Detailed error codes and messages
3. **Input Validation**: Multi-layer validation with specific error messages
4. **Database Error Handling**: Separate error handling for connection, query, and insertion errors
5. **Environment Validation**: Startup checks for required environment variables

### Common Issues & Solutions

#### MongoDB Connection Issues

**Problem**: `DB_CONNECTION_ERROR`
**Solutions:**
1. Check if MongoDB is running locally
2. Verify MONGODB_URI in environment variables
3. Check network connectivity for MongoDB Atlas
4. Ensure database credentials are correct

#### Validation Errors

**Problem**: `VALIDATION_ERROR`
**Solutions:**
1. Check email format (must be valid email)
2. Password requirements:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter  
   - At least 1 number
3. Name must be 2-50 characters, letters only

#### Environment Configuration

**Problem**: `CONFIG_ERROR`
**Solutions:**
1. Create `.env.local` file
2. Add required environment variables
3. Restart development server

### Development Debugging

To enable debug logging in development:

```bash
NODE_ENV=development npm run dev
```

To test the registration endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

### Production Considerations

1. **Log Level**: Set to INFO or WARN in production
2. **Error Monitoring**: Consider integrating with Sentry or similar service
3. **Rate Limiting**: Implement rate limiting for registration endpoint
4. **Email Verification**: Add email verification workflow
5. **Password Policy**: Consider additional password requirements

## Architecture

### File Structure

```
src/
├── app/
│   └── api/
│       └── auth/
│           └── register/
│               └── route.ts          # Registration endpoint
├── lib/
│   ├── logger.ts                     # Centralized logging utility
│   ├── validation.ts                 # Input validation functions
│   └── config.ts                     # Environment configuration
├── types/
│   └── auth.ts                       # TypeScript interfaces
└── middleware.ts                     # Request logging middleware
```

### Key Features

- **TypeScript**: Full type safety
- **Structured Logging**: Consistent logging format
- **Error Handling**: Comprehensive error management
- **Input Validation**: Multi-layer validation
- **Security**: bcrypt password hashing (12 rounds)
- **Monitoring**: Request ID tracking and timing

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
