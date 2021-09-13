'use strict';

const { WebSocketServer } = require('ws');

class GameServer {
  handlers = {};

  constructor() {

    this.handlers['gamestate'] = (ws, request) => {
      const response = {
        type: 'gamestate',
        gamestate: this.engine.gameState
      };
      ws.send(JSON.stringify(response));
    };

    ///TODO: game engine integration
    this.engine = {
      gameState: {
        drones: [
          {
            pos: { x: 0, y: 1, z: 2 }
          },
          {
            pos: { x: 3, y: 4, z: 5 }
          }
        ]
      }
    };

  }

  handleMessage(ws, request) {
    if (this.handlers[request.type]) {
      this.handlers[request.type](ws, request);
    } else {
      console.log(`unknown request type: ${request}`);
    }
  }

  listen(host, port) {
    this.wss = new WebSocketServer({ host, port });

    this.wss.on('connection', (ws) => {

      ws.on('message', (message) => {
        const request = JSON.parse(message);
        this.handleMessage(ws, request);
      });

    });
  }

}

module.exports = { GameServer };
