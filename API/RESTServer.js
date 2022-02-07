'use strict';


class RESTServer {
  app = null;
  engine = null;
  logger = null;

  constructor(engineRef) {
    this.engine = engineRef;
    const logfile = Math.round(+new Date()/1000);
    if (!require('fs').existsSync('./log/')) {
      require('fs').mkdirSync('./log/');
    }
    this.logger = require('logger').createLogger(`./log/${logfile}.log`);

    const express = require('express');
    this.app = express();

    this.app.use(express.json({limit: '1mb'}));

    const logger_temp = (req, res, next) => {
      // this.logger.info(req);
      next();
    };
    this.app.use(logger_temp);

    // create drone
    this.app.post('/drone', (req, res) => {
      const {id, token} = this.engine.createDrone();
      this.logger.info(`drone ${id} has been created with token ${token}`);
      res.status(201).send({ id, token });
    });

    // update AI
    this.app.put('/drone', (req, res) => {
      const id = req.body.id;
      const token = req.body.token;
      const ai = req.body.ai;

      if (!this.engine.validateToken(id, token)) {
        this.logger.info(`drone ${id} wrong token ${token}`);
        res.status(401).send({});
        return;
      }

      ///TODO: validate ai
      this.engine.setDroneAI(id, ai);
      this.logger.info(`drone ${id} uploaded ai code`);
      res.status(200).send({});
    });

    // get current AI
    this.app.get('/drone', (req, res) => {
      const id = req.body.id;
      const token = req.body.token;
      const ai = this.engine.exportDroneAI(id);

      if (!this.engine.validateToken(id, token)) {
        this.logger.info(`drone ${id} wrong token ${token}`);
        res.status(401).send({});
        return;
      }

      this.logger.info(`drone ${id} requested ai code`);
      res.status(200).send({ id, ai });
    });

    // get current drone state
    this.app.get('/drone_state', (req, res) => {
      const id = req.body.id;
      const token = req.body.token;
      const state = this.engine.exportDroneState(id);

      if (!this.engine.validateToken(id, token)) {
        this.logger.info(`drone ${id} wrong token ${token}`);
        res.status(401).send({});
        return;
      }

      this.logger.info(`drone ${id} requested drone state`);
      res.status(200).send({ id, state });
    });
  }

  listen(config) {
    this.app.listen(config.port, config.host);
  }
}

module.exports = { RESTServer };
