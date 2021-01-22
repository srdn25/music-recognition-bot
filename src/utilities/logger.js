const winston = require('winston');
const { toRawType } = require('../utilities/tools');

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

const convertErrorTypeToFn = (err, fn) => {
  switch (toRawType(err)) {
    case 'error':
      fn(err.toString());
      break;
    case 'object':
      fn(JSON.stringify(err));
      break;
    default:
      fn(err);
  }
};

const rawError = logger.error;
logger.error = (err) => convertErrorTypeToFn(err, rawError);

const rawInfo = logger.info;
logger.info = (err) => convertErrorTypeToFn(err, rawInfo);

const rawWarn = logger.warn;
logger.warn = (err) => convertErrorTypeToFn(err, rawWarn);

module.exports = logger;
