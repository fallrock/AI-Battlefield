'use strict';

const { WebSocket, WebSocketServer } = require('ws');

class GameServer {
  handlers = {};
  engine = null;
  tickTimer = null;

  constructor(engineRef) {

    this.handlers['gamestate'] = (ws, request) => {
      const response = {
        type: 'gamestate',
        gamestate: JSON.parse(this.engine.exportGameState())
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

    this.tickTimer = setInterval(() => {
      this.engine.onTick();
      this._broadcastGameState();
    }, 1000 / this.engine.gameState.tps);
  }

  _broadcastGameState() {
    const message = {
      type: 'gamestate',
      gamestate: JSON.parse(this.engine.exportState())
    };
    this._broadcast(message);
  }

  _broadcast(json) {
    const message = JSON.stringify(json);
    this.wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

}

module.exports = { GameServer };
