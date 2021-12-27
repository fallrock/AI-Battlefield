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

    ///TODO: validate tokens and stuff

    // create drone
    this.app.post('/drone', (req, res) => {
      const id = this.engine.createDrone();
      const token = 'GENERATED SECRET TOKEN';
      this.logger.info(`drone ${id} has been created`);
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
      this.logger.info(`drone ${id} uploaded ai code`);
      res.status(200).send({});
    });

    // get current AI
    this.app.get('/drone', (req, res) => {
      const id = req.body.id;
      const token = req.body.token;
      const ai = this.engine.exportDroneAI(id);
      this.logger.info(`drone ${id} requested ai code`);
      res.status(200).send({ id, ai });
    });
  }

  listen(config) {
    this.app.listen(config.port, config.host);
  }
}

module.exports = { RESTServer };
