'use strict';

const { config } = require('./config.js');
const { GameServer } = require('./gameServer.js');
const { FrontendServer } = require('./frontendServer.js');

const gameServer = new GameServer();
gameServer.listen(config.backend.host, config.backend.port);

const frontendServer = new FrontendServer();
frontendServer.listen(config.frontend.host, config.frontend.port);
