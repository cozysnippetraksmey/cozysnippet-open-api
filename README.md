# CozySnippet Open API

A production-ready REST API built with [Hono](https://hono.dev/) and TypeScript, designed for Cloudflare Workers.

## 🚀 Features

- **Type-safe** - Built with TypeScript and Zod validation
- **Production-ready** - Includes error handling, rate limiting, CORS, and security headers
- **Well-structured** - Clean architecture with controllers, services, and middleware
- **Tested** - Unit tests with Vitest
- **Documented** - OpenAPI/Swagger documentation included
- **Linted** - ESLint configuration for code quality

## 📋 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Get all users |
| GET | `/api/v1/users/:id` | Get user by ID |
| POST | `/api/v1/users` | Create new user |
| PUT | `/api/v1/users/:id` | Update user |
| DELETE | `/api/v1/users/:id` | Delete user |
| POST | `/api/v1/users/seed` | Seed random users |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/docs` | OpenAPI documentation |

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## 📝 API Usage Examples

### Create a user
```bash
curl -X POST http://localhost:8787/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25
  }'
```

### Get all users
```bash
curl http://localhost:8787/api/v1/users
```

### Update a user
```bash
curl -X PUT http://localhost:8787/api/v1/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "age": 26
  }'
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🔍 Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## 🚀 Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## 📊 Rate Limiting

The API includes rate limiting:
- **Window**: 15 minutes
- **Max requests**: 100 per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🔒 Security Features

- CORS protection
- Rate limiting
- Input validation with Zod
- Custom error handling
- Request ID tracking
- Security headers

## 🏗️ Architecture

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── routes/         # Route definitions
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## 📚 Environment Variables

See `.env.example` for all available environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `ALLOWED_ORIGINS` - CORS allowed origins
- `API_VERSION` - API version
- `RATE_LIMIT_*` - Rate limiting configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
