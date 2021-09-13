'use strict';

const { config } = require('./config.js');
const { GameServer } = require('./gameServer.js');

const gameServer = new GameServer();
gameServer.listen(config.host, config.port);
