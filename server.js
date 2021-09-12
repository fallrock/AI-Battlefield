'use strict';

import { WebSocketServer } from 'ws';

export class Server {

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
