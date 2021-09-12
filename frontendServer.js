'use strict';

class FrontendServer {
  constructor() {
    this.app = require('express')();
  }

  listen(port) {
    this.app.listen(port);
  }
}

module.exports = { FrontendServer };
