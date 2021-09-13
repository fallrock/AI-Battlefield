'use strict';

const { config } = require('./config.js');
const { APIServer } = require('./APIServer.js');

const api = new APIServer();
api.listen(config.host, config.port);
