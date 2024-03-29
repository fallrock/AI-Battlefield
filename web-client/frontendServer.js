'use strict';

const fs = require('fs');

class FrontendServer {
  constructor() {
    this.app = require('express')();
  }

  listen(host, port) {

    ///TODO: full frontend experience
    this.app.get('/', (req, res) => {
      res.send(fs.readFileSync('client/index.html', 'utf-8'));
    });
    this.app.get('/client.js', (req, res) => {
      res.send(fs.readFileSync('client/client.js', 'utf-8'));
    });
    this.app.get('/vec2.js', (req, res) => {
      res.send(fs.readFileSync('client/vec2.js', 'utf-8'));
    });
    this.app.get('/transforms.js', (req, res) => {
      res.send(fs.readFileSync('client/transforms.js', 'utf-8'));
    });

    this.app.listen(port, host);

  }
}

module.exports = { FrontendServer };
