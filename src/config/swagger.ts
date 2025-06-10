import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API Documentation for E-Commerce Backend',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api/v1',
      },
    ],
    paths: {}
  },
  apis: ['src/api/v1/routes/**/*.ts', 'src/api/v1/controllers/**/*.ts', 'src/models/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
