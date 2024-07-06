
const config = require('../src/config/cloud');
const swaggerAutogen = require('swagger-autogen')();
const msg = require('../src/utils/lang/messages');

const options = {
  openapi: 'OpenAPI 3',
  language: 'en-US',    
  disableLogs: false,
  autoHeaders: false,
  autoQuery: false,
  autoBody: false  
};

const doc = {
  info: {
    version: '2.0.0',
    title: 'Social Media REST APIS',
  },
  host: config.swagger.host,
  basePath: '/', 
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    // ******************* not working ****************************
    // {
    //   name: 'Signup Apis',
    //   description: 'Apis for registration of new user.',
    // },
    // {
    //     name: 'Login Apis',
    //     description: 'Apis for logging in an existing user.'
    // }
  ],
  securityDefinitions: {},
  definitions: {
    "successResponse": {
      code: msg.response.CAG001.code,
      message: msg.response.CAG001.message,
    },
    'errorResponse.400': {
      code: msg.response.CAGE002.code,
      message: msg.response.CAGE002.message,
    },
    'errorResponse.403': {
      code: msg.response.CAGE001.code,
      message: msg.response.CAGE001.message,
    },
    'errorResponse.404': {
      "code": "404",
      "message": "Not found",
    },
    'errorResponse.500': {
      code: msg.response.CAGE003.code,
      message: msg.response.CAGE003.message,
    }
  },
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['../src/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
