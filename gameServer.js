'use strict';

const { WebSocketServer } = require('ws');

class GameServer {
  handlers = {};

  constructor(engineRef) {

    this.handlers['gamestate'] = (ws, request) => {
      const response = {
        type: 'gamestate',
        gamestate: this.engine.gameState
      };
      ws.send(JSON.stringify(response));
    };

    this.engine = engineRef;

  }

  handleMessage(ws, request) {
    if (this.handlers[request.type]) {
      this.handlers[request.type](ws, request);
    } else {
      console.log(`unknown request type: ${request}`);
    }
  }

  listen(config) {
    this.wss = new WebSocketServer(config);

    this.wss.on('connection', (ws) => {

      ws.on('message', (message) => {
        const request = JSON.parse(message);
        this.handleMessage(ws, request);
      });

    });
  }

}

module.exports = { GameServer };
