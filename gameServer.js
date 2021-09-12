'use strict';

const { WebSocketServer } = require('ws');

class GameServer {

  constructor() {
    ///TODO:
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

  listen(host, port) {
    this.wss = new WebSocketServer({ host, port });

    this.wss.on('connection', (ws) => {

      ///TODO:
      // proper packet creating
      // messageHandler[message.type](message.body)
      ws.on('message', (message) => {
        const request = JSON.parse(message);

        switch (request.type) {
          case 'gamestate':
            ws.send(JSON.stringify(
              {
                type: 'gamestate',
                gamestate: this.engine.gameState
              }
            ));
            break;
          default:
            console.log(`unknown message type ${request}`);
        }
      });

    });
  }

}

module.exports = { GameServer };
