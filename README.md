# Financial Tracker API

A RESTful API for personal financial management built with Node.js, Express, TypeScript, and MongoDB. This application allows users to track their income and expenses, categorize transactions, and generate financial reports.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Testing](#testing)
- [Development](#development)
- [Error Handling](#error-handling)

## Features

- **User Authentication**: Secure registration, login, logout with JWT tokens
- **Transaction Management**: Create, read, update, delete income and expense transactions
- **Category Management**: Organize transactions with custom categories
- **Financial Reports**: Generate comprehensive financial reports with breakdowns
- **Data Validation**: Robust input validation using Zod schemas
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript implementation
- **Unit Testing**: Comprehensive test coverage with Jest

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Code Quality**: ESLint, Prettier

## Project Structure

```
financial-tracker-api/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── report.controller.ts
│   │   └── transaction.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.ts
│   ├── models/
│   │   ├── category.model.ts
│   │   ├── refresh-token.model.ts
│   │   ├── report.model.ts
│   │   ├── transaction.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── categories.route.ts
│   │   ├── report.routes.ts
│   │   ├── transaction.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── categories.service.ts
│   │   ├── report.service.ts
│   │   └── transaction.service.ts
│   ├── utils/
│   │   ├── swagger-options.ts
│   │   ├── swagger-schemas.ts
│   │   └── types.ts
│   └── validators/
│       ├── category.validator.ts
│       ├── report.validator.ts
│       ├── transaction.validator.ts
│       └── user.validator.ts
├── tests/
│   └── unit/
├── .env
├── package.json
├── tsconfig.json
├── jest.config.cjs
└── README.md
```

## Installation

1. **Clone the repository**

```bash
   git clone <repository-url>
   cd financial-tracker-api
```

2. **Install dependencies**

```bash
   npm install
```

3. **Set up environment variables**

```bash
   cp .env.example .env
```

## Configuration

Create a .env file in the root directory with the following variables:

### Database

```
DB_URL=mongodb://localhost:27017/financial-tracker
```

### Server

```
PORT=3000
NODE_ENV=development
```

### JWT Secrets

```
JWT_SECRET=your_jwt_secret_key
JWT_SECRET_REFRESH=your_jwt_refresh_secret_key
```

## API Documentation

The API documentation is available via Swagger UI when the server is running:

- **Swagger UI**: http://localhost:3000/api-docs

The documentation includes detailed information about all endpoints, request/response schemas, and authentication requirements.

## Authentication

The API uses JWT-based authentication with access and refresh tokens:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (30 days), used to generate new access tokens, kept in cookies

### Authentication Flow

1. Register or login to receive tokens
2. Include access token in Authorization header: Bearer <token>
3. Use refresh token to get new access token when expired
4. Logout to invalidate refresh token

## Endpoints

### Authentication

- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- POST /api/auth/refresh-token - Refresh access token

### Categories

- GET /api/categories - Get all user categories
- GET /api/categories/:id - Get category by ID
- POST /api/categories - Create new category
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category

### Transactions

- GET /api/transactions - Get all user transactions
- GET /api/transactions/:id - Get transaction by ID
- POST /api/transactions - Create new transaction
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction

### Reports

- GET /api/reports - Get all saved reports
- GET /api/reports/:id - Get report by ID
- GET /api/reports/generate - Generate report for date range
- GET /api/reports/latest - Get last month report
- POST /api/reports - Save report
- DELETE /api/reports/:id - Delete report

## Testing

The project includes comprehensive unit tests using Jest:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test:auth
```

### Test Coverage

- **Authentication Service**: User registration, login, logout, token refresh
- **Transaction Service**: CRUD operations, validation, authorization
- **Category Service**: CRUD operations, validation, authorization
- **Report Service**: Report generation, data aggregation, persistence

## Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Run tests
npm run test
```

### Development Workflow

1. Start the development server: npm run dev
2. Make changes to TypeScript files
3. The server automatically restarts on file changes
4. Access API documentation at http://localhost:3000/api-docs

## Error Handling

The API implements centralized error handling with consistent error responses:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes

- 200 - Success
- 201 - Created
- 204 - No Content
- 400 - Bad Request (validation errors)
- 401 - Unauthorized (authentication required)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found
- 409 - Conflict (resource already exists)
- 500 - Internal Server Error

## Data Models

### User

- firstName (string)
- email (string, unique)
- password (string, hashed)
- createdAt (date)

### Category

- name (string)
- description (string, optional)
- color (string, hex color)
- userId (ObjectId, reference to User)

### Transaction

- amount (number)
- type (enum: 'income' | 'expense')
- description (string)
- categoryName (string)
- categoryId (ObjectId, reference to Category)
- userId (ObjectId, reference to User)
- date (date)

### Report

- userId (ObjectId, reference to User)
- dateFrom (date)
- dateTo (date)
- totalIncome (number)
- totalExpenses (number)
- netBalance (number)
- incomeByCategory (array)
- expensesByCategory (array)
- dailyBreakdown (array)
- createdAt (date)

## License

This project is licensed under the ISC License.
