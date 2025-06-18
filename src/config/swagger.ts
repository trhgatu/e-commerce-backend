// src/config/swagger.ts

import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

const servers = [
  {
    url: process.env.API_URL || 'http://localhost:5000/api/v1',
    description: isDev ? 'Local Development Server' : 'Production Server',
  },
];

if (!isDev) {
  servers.push({
    url: 'http://localhost:5000/api/v1',
    description: 'Local Development Server (Reference)',
  });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API Documentation for E-Commerce Backend',
    },
    servers,
  },
  apis: [
    'src/modules/**/*.controller.ts',
    'src/modules/**/*.routes.ts',
    'src/modules/**/docs/*.swagger.ts',
    'src/common/models/**/*.ts',
    'src/docs/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
