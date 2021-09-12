'use strict';

import { Server } from './server.js';

const config = {
  port: process.env.PORT || 8080
};

const server = new Server();
server.listen(config.port);
