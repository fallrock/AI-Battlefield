'use strict';

import { Server } from './server.js';
import { config } from './config.js';

const server = new Server();
server.listen(config.port);
