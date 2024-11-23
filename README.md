<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS API Boilerplate

A modern API Boilerplate with NestJS 10.x featuring:
- 🚀 Fastify as HTTP provider
- 🗄️ DrizzleORM with PostgreSQL
- 🔐 JWT Authentication
- 📝 OpenAPI/Swagger documentation
- 📊 Pino Logger
- 🔒 Rate limiting
- 🎯 Request validation
- ⚡ CORS support

## Installation

```bash
pnpm install
```

## Environment Setup

```bash
cp .env.example .env.local
```

Configure your environment variables for different environments:
```bash
cp .env.example .env.dev    # Development
cp .env.example .env.stage  # Staging
cp .env.example .env.prod   # Production
```

## Key Environment Variables

### Server Configuration
```env
NODE_ENV=dev
SERVER_PORT=5000
SERVER_HOST=localhost
ENDPOINT_URL_CORS=http://localhost:3000
```

### Swagger Documentation
```env
SWAGGER_USER=your_username
SWAGGER_PASSWORD=your_password
```

### Database Configuration
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PW=password
DB_NAME=default_db_2
```

### JWT Configuration
```env
JWT_SECRET_KEY=secretOrKey
JWT_TOKEN_AUDIENCE=localhost:5000
JWT_TOKEN_ISSUER=localhost:5000
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=86400
```

### Rate Limiting
```env
THROTTLE_TTL=60
THROTTLE_LIMIT=20
```

## Database Migrations

Generate migration:
```bash
pnpm run generate
```

Apply migration:
```bash
pnpm run migrate
```

## Running the Application

```bash
# Development
pnpm start:dev

# Production
pnpm start:prod

# Debug mode
pnpm start:debug
```

## API Documentation

Swagger documentation is available at:
```
http://localhost:5000/docs
```

JSON format:
```
http://localhost:5000/docs-json
```

YAML format:
```
http://localhost:5000/docs-yaml
```

## Authentication Examples

### Login
```bash
curl -H 'content-type: application/json' -X POST \
  -d '{"email": "user@example.com", "password": "password123"}' \
  http://localhost:5000/api/auth/login
```

### Register
```bash
curl -H 'content-type: application/json' -X POST \
  -d '{"name": "John Doe", "email": "user@example.com", "username":"johndoe", "password": "password123"}' \
  http://localhost:5000/api/auth/register
```

### Refresh Token
```bash
curl -H 'content-type: application/json' -X POST \
  -d '{"refreshToken": "your_refresh_token"}' \
  http://localhost:5000/api/auth/refresh-tokens
```

## Features

- **Fast HTTP Server**: Using Fastify instead of Express for better performance
- **Modern ORM**: DrizzleORM with PostgreSQL support
- **Comprehensive Logging**: Pino logger with request tracing
- **API Documentation**: Auto-generated Swagger documentation
- **Security**: 
  - JWT authentication
  - Rate limiting
  - CORS protection
  - Request validation
- **Developer Experience**:
  - Hot reload in development
  - TypeScript support
  - ESLint + Prettier configuration
  - Jest testing setup
  - Husky git hooks

## License

[MIT licensed](LICENSE)
