export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Financial Tracker application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/utils/swagger-schemas.ts'],
};
