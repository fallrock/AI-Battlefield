'use strict';

const { config } = require('./config.js');
const { GameServer } = require('./gameServer.js');
const { RESTServer } = require('./RESTServer.js');

const gameServer = new GameServer();
gameServer.listen(config.gameServer);

const restServer = new RestServer();
restServer.listen(config.RESTServer);
