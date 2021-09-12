'use strict';

const { GameServer } = require('./gameServer.js');
const { config } = require('./config.js');
const { FrontendServer } = require('./frontendServer.js');

const gameServer = new GameServer();
gameServer.listen(config.BACKEND_PORT);

const frontendServer = new FrontendServer();
frontendServer.listen(config.FRONTEND_PORT);
