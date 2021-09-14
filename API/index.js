'use strict';

const { config } = require('./config.js');
const { GameServer } = require('./gameServer.js');
const { RESTServer } = require('./RESTServer.js');

const engine = require('./engine/engine.js');

const gameServer = new GameServer(engine);
gameServer.listen(config.gameServer);

const restServer = new RESTServer(engine);
restServer.listen(config.RESTServer);

setInterval(() => {
    engine.onTick();
}, 5000);
