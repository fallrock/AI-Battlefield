'use strict';

class RESTServer {
  app = null;
  engine = null;

  constructor(engineRef) {
    this.engine = engineRef;

    const express = require('express');
    this.app = express();

    this.app.use(express.json({limit: '1mb'}));

    const logger = (req, res, next) => {
      // console.log(req);
      next();
    };
    this.app.use(logger);

    ///TODO: validate tokens and stuff

    // create drone
    this.app.post('/drone', (req, res) => {
      const id = this.engine.createDrone();
      const token = 'GENERATED SECRET TOKEN';
      console.log(`drone ${id} has been created`);
      res.status(201).send({ id, token });
    });

    // update AI
    this.app.put('/drone', (req, res) => {
      const id = req.body.id;
      const token = req.body.token;
      const ai = req.body.ai;
      ///TODO: check token
      ///TODO: validate ai
      this.engine.setDroneAI(id, ai);
      console.log(`drone ${id} uploaded ai code`);
      res.status(200).send({});
    });

    // get current AI
    this.app.get('/drone', (req, res) => {
      const id = req.body.id;
      const token = req.body.token;
      const ai = this.engine.exportDroneAI(id);
      console.log(`drone ${id} requested ai code`);
      res.status(200).send({ id, ai });
    });
  }

  listen(config) {
    this.app.listen(config.port, config.host);
  }
}

module.exports = { RESTServer };
