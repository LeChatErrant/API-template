import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'API-template documentation',
      version: '1.0.0',
      description: 'Simple production-ready API template',
    },
    basePath: '/',
    externalDocs: {
      description: 'Find out more about Swagger',
      url: 'http://swagger.io ',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/LeChatErrant/API-template/blob/master/LICENSE',
    },
    security: [{
      cookieAuth: [],
    }],
    servers: [{
      url: 'http://localhost:8000',
      description: 'Local server',
    }, {
      url: 'https://dev.api-template.com',
      description: 'Development server',
    }, {
      url: 'https://api.api-template.com',
      description: 'Production server',
    }],
  },
  apis: ['**/*.ts'],
  basePath: '/',
});

export const swaggerUiOptions = {
  explorer: true,
};
