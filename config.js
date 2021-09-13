'use strict';

const config = {
  host: process.env.BACKEND_HOST || '0.0.0.0',
  port: process.env.BACKEND_PORT || 8081
};

module.exports = { config };
