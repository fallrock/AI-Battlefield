'use strict';

const { WebSocketServer } = require('ws');

class GameServer {

  listen(port) {
    this.wss = new WebSocketServer({ port: port });

    this.wss.on('connection', (ws) => {

      ws.on('message', (message) => {
        console.log(`message: ${message}`);
      });

      ws.send('${message}');

    });
  }

}

module.exports = { GameServer };
