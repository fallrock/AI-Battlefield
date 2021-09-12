'use strict';

const fs = require('fs');

class FrontendServer {
  constructor() {
    this.app = require('express')();
  }

  listen(host, port) {

    this.app.get('*', (req, res) => {
      res.send(fs.readFileSync('index.html', 'utf-8'));
    });

    this.app.listen(port, host);

  }
}

module.exports = { FrontendServer };
