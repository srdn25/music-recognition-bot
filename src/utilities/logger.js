const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
      consoleWarnLevels: ['warn', 'debug'],
    }),
  ],
});

module.exports = logger;
