'use strict';

const { config } = require('./config.js');
const { FrontendServer } = require('./frontendServer.js');

const frontendServer = new FrontendServer();
frontendServer.listen(config.host, config.port);
