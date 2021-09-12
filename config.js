'use strict';

const config = {
  BACKEND_PORT: process.env.BACKEND_PORT || 8081,
  FRONTEND_PORT: process.env.FRONTEND_PORT || 8080
};

module.exports = { config };
