'use strict';

const config = {
  backend: {
    host: process.env.BACKEND_HOST || '0.0.0.0',
    port: process.env.BACKEND_PORT || 8081
  },
  frontend: {
    host: process.env.FRONTEND_HOST || '0.0.0.0',
    port: process.env.BACKEND_PORT || 8080
  }
};

module.exports = { config };
