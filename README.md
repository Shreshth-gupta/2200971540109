# URL Shortener Microservice

## Architecture Overview

A scalable HTTP URL shortener microservice built with Node.js and Express, featuring comprehensive logging, analytics, and robust error handling.

## System Design

### Core Components

1. **API Layer** (`routes.js`) - RESTful endpoints for URL operations
2. **Storage Layer** (`storage.js`) - In-memory data persistence with Map structures
3. **Utility Layer** (`utils.js`) - Validation, shortcode generation, and helper functions
4. **Logging Middleware** (`../loggingmiddleware`) - Centralized logging to external service
5. **Server** (`server.js`) - Express application setup and middleware configuration

### Data Model

```javascript
// URL Data Structure
{
  originalUrl: string,
  shortcode: string,
  expiry: ISO8601 timestamp,
  createdAt: ISO8601 timestamp
}

// Click Analytics Structure
{
  timestamp: ISO8601 timestamp,
  referrer: string,
  location: string
}
```

## Technology Choices

### Backend Framework: Express.js
- **Justification**: Lightweight, mature, extensive middleware ecosystem
- **Benefits**: Fast development, robust routing, middleware support

### Storage: In-Memory Maps
- **Justification**: Simple implementation for MVP, fast access times
- **Trade-offs**: Data loss on restart, memory limitations
- **Production Alternative**: Redis/MongoDB for persistence and scalability

### Logging: External HTTP Service
- **Justification**: Centralized logging for monitoring and debugging
- **Implementation**: Custom middleware with authentication and message truncation

## Key Design Decisions

### 1. Shortcode Generation Strategy
- **Approach**: Random alphanumeric generation with collision detection
- **Length**: 6 characters
- **Validation**: Alphanumeric only, 1-10 character limit

### 2. URL Validation
- **Method**: Native URL constructor for robust validation
- **Benefits**: Handles edge cases, protocol validation

### 3. Expiry Management
- **Default**: 30 minutes
- **Implementation**: ISO8601 timestamps with runtime validation
- **Cleanup**: Lazy deletion on access

### 4. Error Handling
- **HTTP Status Codes**: 400, 404, 409, 410, 500
- **Response Format**: Consistent JSON error objects
- **Logging**: All errors logged with context

### 5. Analytics Implementation
- **Click Tracking**: Timestamp, referrer, location per click
- **Storage**: Separate Map for click data
- **Privacy**: Coarse-grained location (placeholder implementation)

## API Endpoints

### POST /shorturls
Creates a shortened URL with an optional custom shortcode and validity period.

### GET /shorturls/:shortcode
Returns comprehensive statistics, including click analytics.

### GET /:shortcode
Redirects to the  original URL and records click analytics.

## Scalability Considerations

### Current Limitations
- In-memory storage (single instance)
- No data persistence
- No rate limiting
- Basic location services

### Production Enhancements
- **Database**: Redis for caching, PostgreSQL for persistence
- **Caching**: Multi-layer caching strategy
- **Load Balancing**: Horizontal scaling with session affinity
- **Rate Limiting**: Per-IP request throttling
- **Monitoring**: Health checks, metrics collection
- **Security**: Input sanitization, HTTPS enforcement

## Assumptions

1. **Authentication**: Pre-authorized users (no auth required)
2. **Scale**: Moderate traffic for MVP implementation
3. **Persistence**: Acceptable data loss on restart for demo
4. **Location**: Placeholder implementation sufficient
5. **Shortcode Conflicts**: Rare enough for retry strategy

## Security Measures

- Input validation on all endpoints
- URL format verification
- Shortcode format restrictions
- Error message sanitization
- No sensitive data exposure

## Monitoring & Observability

- Comprehensive logging at all layers
- Request/response tracking
- Error categorization
- Performance metrics via logging middleware

## Future Improvements

1. **Database Integration**: Persistent storage layer
2. **Caching Strategy**: Redis for hot data
3. **Rate Limiting**: Prevent abuse
4. **Analytics Dashboard**: Real-time statistics
5. **Custom Domains**: Branded short links
6. **Bulk Operations**: Batch URL creation
7. **API Versioning**: Backward compatibility
8. **Health Monitoring**: Service status endpoints

## Installation & Usage

```bash
npm install
npm start
```

Server runs on port 3000 with comprehensive logging to evaluation service.
