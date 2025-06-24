import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import path from 'path';

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

const basePath = isDev ? './src' : './dist';

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
    path.join(basePath, 'modules/**/*.controller.{ts,js}'),
    path.join(basePath, 'modules/**/*.routes.{ts,js}'),
    path.join(basePath, 'modules/**/docs/*.{ts,js}'),
    path.join(basePath, 'common/models/**/*.{ts,js}'),
    path.join(basePath, 'docs/**/*.{ts,js}'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
