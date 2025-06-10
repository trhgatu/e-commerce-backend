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
  // Optionally add local server for reference in non-dev environments
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
    paths: {},
  },
  apis: ['src/api/v1/routes/**/*.ts', 'src/api/v1/controllers/**/*.ts', 'src/models/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);