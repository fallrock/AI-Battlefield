'use strict';

const config = {
  host: process.env.FRONTEND_HOST || '0.0.0.0',
  port: process.env.BACKEND_PORT || 8080
};

module.exports = { config };
