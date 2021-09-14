'use strict';

class RESTServer {
  app = null;

  constructor() {
    const express = require('express');
    this.app = express();

    this.app.use(express.json());

    const logger = (req, res, next) => {
      // console.log(req);
      next();
    };
    this.app.use(logger);

    ///TODO: validate tokens and stuff

    // create drone
    this.app.post('/drone', (req, res) => {
      ///TODO: create the drone
      const token = 'GENERATED SECRET TOKEN';
      const id = 'GENERATED PUBLIC ID';
      res.status(201).send({ id, token });
    });

    // update AI
    this.app.patch('/drone/:id', (req, res) => {
      const token = req.body.token;
      const id = req.params.id;
      const ai = req.body.ai;
      ///TODO: update AI
      res.status(200).send({ id, ai });
    });

    // get current AI
    this.app.get('/drone/:id', (req, res) => {
      const token = req.body.token;
      const id = req.params.id;
      ///TODO: get the AI
      const ai = 'while (true) {}';
      res.status(200).send({ id, ai });
    });
  }

  listen(config) {
    this.app.listen(config.port, config.host);
  }
}

module.exports = { RESTServer };
