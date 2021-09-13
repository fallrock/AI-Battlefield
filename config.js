'use strict';

const config = {
  gameServer: {
    host: process.env.GAMESERVER_HOST || '0.0.0.0',
    port: process.env.GAMESERVER_PORT || 8081
  },
  REST: {
    host: process.env.REST_HOST || '0.0.0.0',
    port: process.env.REST_PORT || 8082
  }
};

module.exports = { config };
