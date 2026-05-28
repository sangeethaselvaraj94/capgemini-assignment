const { createLogger, format, transports } = require('winston');
const path = require('path');
require('dotenv').config({ quiet: true });

const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || 'logs/app.log';

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),
    new transports.File({ filename: path.resolve(process.cwd(), logFile) }),
  ],
  exitOnError: false,
});

module.exports = logger;
