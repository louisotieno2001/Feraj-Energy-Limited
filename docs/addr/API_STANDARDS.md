# API Standards

## Overview

This document defines the API standards and guidelines for Feraj Solar Limited's web applications and services. These standards ensure consistency, maintainability, and scalability across all API implementations.

## General Principles

### RESTful Design
- Use REST architectural principles for all HTTP APIs
- Follow resource-based URL structure
- Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Implement proper HTTP status codes
- Use JSON as the primary data format

### API Versioning
- Include version in URL path: `/api/v1/`
- Maintain backward compatibility for at least 2 major versions
- Deprecation notices should be provided 6 months in advance
- Use semantic versioning (Major.Minor.Patch)

## URL Structure

### Base URL
```
Production: https://api.ferajsolar.com/v1/
Development: https://dev-api.ferajsolar.com/v1/
Local: http://localhost:3000/api/v1/
```

### Resource Naming
- Use plural nouns for resource names: `/products`, `/users`, `/orders`
- Use kebab-case for multi-word resources: `/solar-panels`, `/energy-systems`
- Nest resources logically: `/users/{id}/orders`, `/products/{id}/reviews`
- Avoid deep nesting (max 2 levels)

### Query Parameters
- Use camelCase for parameter names
- Implement standard parameters:
  - `page` and `limit` for pagination
  - `sort` for sorting (e.g., `sort=name,-createdAt`)
  - `filter` for filtering resources
  - `search` for full-text search

## HTTP Methods

### GET
- Retrieve resources
- Should be idempotent and safe
- Use for listing and detail endpoints

```javascript
// List products
GET /api/v1/products

// Get specific product
GET /api/v1/products/123
```

### POST
- Create new resources
- Use for non-idempotent operations
- Return 201 Created with location header

```javascript
// Create new product
POST /api/v1/products
Content-Type: application/json

{
  "name": "Solar Panel 400W",
  "category": "panels",
  "price": 25000
}
```

### PUT
- Complete resource replacement
- Should be idempotent
- Return 200 OK or 204 No Content

### PATCH
- Partial resource updates
- Should be idempotent
- Return 200 OK with updated resource

### DELETE
- Remove resources
- Should be idempotent
- Return 204 No Content

## Response Standards

### Success Responses

#### Single Resource
```json
{
  "data": {
    "id": "123",
    "name": "Solar Panel 400W",
    "category": "panels",
    "price": 25000,
    "createdAt": "2026-01-21T10:00:00Z",
    "updatedAt": "2026-01-21T10:00:00Z"
  }
}
```

#### Collection Response
```json
{
  "data": [
    {
      "id": "123",
      "name": "Solar Panel 400W",
      "category": "panels",
      "price": 25000
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Error Responses

#### Standard Error Format
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product could not be found",
    "details": {
      "productId": "123",
      "requestId": "req_abc123"
    }
  }
}
```

#### Validation Errors
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": [
        {
          "field": "email",
          "message": "Valid email address is required"
        },
        {
          "field": "price",
          "message": "Price must be greater than 0"
        }
      ]
    }
  }
}
```

## Status Codes

### Success Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE

### Client Error Codes
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded

### Server Error Codes
- `500 Internal Server Error` - Unexpected server error
- `502 Bad Gateway` - Upstream service error
- `503 Service Unavailable` - Service temporarily unavailable

## Authentication & Authorization

### JWT Tokens
- Use JWT tokens for authentication
- Include bearer token in Authorization header
- Implement token refresh mechanism
- Set appropriate token expiration times

```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Keys
- Use API keys for service-to-service communication
- Include in `X-API-Key` header
- Implement rate limiting per API key

### Scopes and Permissions
- Define granular permission scopes
- Implement role-based access control (RBAC)
- Use resource-level permissions where needed

## Data Formats

### Date and Time
- Use ISO 8601 format: `2026-01-21T10:00:00Z`
- Always use UTC timezone
- Include timezone information

### Currency
- Store amounts as integers (cents/centimes)
- Include currency code in responses
- Use consistent decimal precision

```json
{
  "price": {
    "amount": 2500000,
    "currency": "KES",
    "formatted": "KES 25,000.00"
  }
}
```

### Localization
- Support multiple languages
- Include `Accept-Language` header processing
- Return localized error messages

## Rate Limiting

### Implementation
- Implement sliding window rate limiting
- Return rate limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Limits
- Authenticated users: 1000 requests/hour
- API keys: 5000 requests/hour
- Unauthenticated: 100 requests/hour

## Documentation

### OpenAPI Specification
- Maintain OpenAPI 3.0 specification
- Generate interactive documentation
- Include request/response examples
- Document all error scenarios

### Endpoint Documentation
Each endpoint should include:
- Purpose and use case
- Required permissions
- Request parameters and body
- Response format and examples
- Error scenarios
- Rate limits

## Testing Standards

### Unit Tests
- Test all API endpoints
- Mock external dependencies
- Achieve minimum 80% code coverage
- Test error scenarios

### Integration Tests
- Test complete request/response cycles
- Verify authentication and authorization
- Test rate limiting
- Validate response formats

## Monitoring and Logging

### Request Logging
- Log all API requests
- Include request ID for tracing
- Log response times and status codes
- Exclude sensitive data from logs

### Metrics
- Track API response times
- Monitor error rates
- Alert on high error rates
- Track usage patterns

### Health Checks
- Implement `/health` endpoint
- Check database connectivity
- Verify external service availability
- Return detailed status information

## Deprecation Policy

### Process
1. Mark endpoints as deprecated in documentation
2. Add deprecation headers to responses
3. Provide migration guide
4. Set removal date (minimum 6 months)
5. Monitor usage and provide support

### Headers
```
Deprecation: true
Sunset: Wed, 21 Jan 2027 10:00:00 GMT
Link: <https://docs.ferajsolar.com/migration>; rel="successor-version"
```

## Security Considerations

### Input Validation
- Validate all input parameters
- Sanitize user input
- Implement SQL injection protection
- Use parameterized queries

### HTTPS
- Use HTTPS for all API communications
- Implement HSTS headers
- Use strong TLS configurations

### CORS
- Configure CORS appropriately
- Limit allowed origins
- Include credentials handling

## Performance Guidelines

### Caching
- Implement appropriate caching strategies
- Use ETags for conditional requests
- Cache frequently accessed data
- Set appropriate cache headers

### Pagination
- Limit response sizes
- Implement cursor-based pagination for large datasets
- Provide navigation links
- Allow configurable page sizes

### Database Optimization
- Use appropriate indexes
- Implement query optimization
- Monitor slow queries
- Use connection pooling

---

**Document Version**: 1.0  
**Last Updated**: January 21, 2026  
**Next Review**: July 21, 2026