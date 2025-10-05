# OpenAPI Documentation Guide

## 🎉 What's Been Added

Your CozySnippet API now has complete OpenAPI 3.0 documentation with:

### 📚 Interactive Documentation
- **Swagger UI**: Available at `/ui` - Interactive API explorer
- **OpenAPI Spec**: Available at `/doc` - JSON specification
- **Auto-generated docs** for all endpoints with examples

### 🛡️ Security Documentation
- **API Key Authentication** (`X-API-Key` header)
- **Bearer Token Authentication** (`Authorization: Bearer`)
- **Admin Authentication** (`X-Admin-Secret` header)

### 📋 Comprehensive Endpoint Documentation

#### Health Endpoints
- `GET /health` - API health check (public)

#### User Management (`/api/v1/users`) - Requires API Key
- `GET /` - Get all users
- `GET /{id}` - Get user by ID
- `POST /` - Create new user
- `PUT /{id}` - Update user
- `DELETE /{id}` - Delete user
- `POST /seed` - Create sample users

#### Admin Endpoints (`/admin`) - Requires Admin Secret
- `GET /health` - Admin system health
- `GET /keys/info` - Get API keys info
- `POST /keys/generate` - Generate new API keys

## 🚀 How to Access Documentation

### 1. Interactive Swagger UI
```bash
# Start your development server
npm run dev

# Open in browser
http://localhost:8787/ui
```

### 2. Raw OpenAPI Specification
```bash
# Get the JSON spec
curl http://localhost:8787/doc
```

### 3. Production Documentation
```bash
# After deployment
https://your-api.workers.dev/ui
```

## 🔧 Features Added

### Request/Response Schemas
- **Validation**: All inputs validated with Zod schemas
- **Examples**: Real examples for all fields
- **Error Responses**: Documented error codes and messages
- **Type Safety**: Full TypeScript integration

### Security Schemes
```yaml
# API Key in header
X-API-Key: cz_your_api_key_here

# Bearer token
Authorization: Bearer cz_your_api_key_here

# Admin secret
X-Admin-Secret: admin_your_secret_here
```

### Response Examples
```json
// Success Response
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 25
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

## 📝 Using the Documentation

### Testing API Endpoints
1. Visit `/ui` in your browser
2. Click "Try it out" on any endpoint
3. Enter your API key in the authorization section
4. Fill in parameters and request body
5. Execute the request directly from the UI

### Generating Client Code
The OpenAPI spec can generate client libraries for:
- JavaScript/TypeScript
- Python
- Java
- PHP
- Go
- And many more languages

### Integration with Tools
- **Postman**: Import the `/doc` URL
- **Insomnia**: Import OpenAPI specification
- **VSCode**: REST Client extensions
- **curl**: Copy examples from Swagger UI

## 🎯 Next Steps

1. **Start Development Server**: `npm run dev`
2. **Visit Swagger UI**: `http://localhost:8787/ui`
3. **Test Endpoints**: Use the interactive documentation
4. **Deploy to Production**: Your docs will be available at your Worker URL
5. **Share with Team**: Send them the `/ui` URL for interactive docs

Your API now has professional-grade documentation that's automatically kept in sync with your code!
