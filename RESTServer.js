'use strict';

class RESTServer {
  constructor() {
    const express = require('express');
    this.app = express();

    const jsonParser = express.json();

    ///TODO: validation

    // create drone
    this.app.post('/drone', jsonParser, (req, res) => {
      ///TODO: create the drone
      const token = 'SECRET TOKEN';
      const id = 'NOT SECRET TOKEN'
      res.status(201).send({ id, token });
    });

    // update AI
    this.app.patch('/drone', jsonParser, (req, res) => {
      const data = res.body;
      const token = data.token;
      const ai = data.ai;
      ///TODO: update ai
      res.status(200).send({ id, ai });
    });

    // get current AI
    this.app.get('/drone', jsonParser (req, res) => {
      const data = res.body;
      const token = data.token;
      ///TODO: get the AI
      const ai = 'while (true) {}';
      res.status(200).send({ id, ai });
    });
  }

  listen(config) {
    this.app.listen(config.port, config.host);
  }
}
