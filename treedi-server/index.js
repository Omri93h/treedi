const app = require('./lib/express');
const logger = require('./lib/logger');
require('dotenv').config();
const port = process.env.port || 5001;
app.listen(port , () => logger.info(`Lisining to Server : ${port}`));