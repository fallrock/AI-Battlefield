'use strict';

class FrontendServer {
  constructor() {
    this.app = require('express')();
  }

  listen(host, port) {
    this.app.listen(port, host);
  }
}

module.exports = { FrontendServer };
