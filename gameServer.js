'use strict';

const { WebSocketServer } = require('ws');

class GameServer {

  listen(host, port) {
    this.wss = new WebSocketServer({ host, port });

    this.wss.on('connection', (ws) => {

      ws.on('message', (message) => {
        console.log(`message: ${message}`);
        ws.send(`${message}`);
      });

    });
  }

}

module.exports = { GameServer };
