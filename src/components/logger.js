const winston = require('winston');
const LogzioWinstonTransport = require('winston-logzio');
const { logzioToken } = require('../../config');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

if (logzioToken) {
  const logzioOptions = {
    level: 'debug',
    name: 'winston_logzio',
    token: logzioToken,
  };

  logger.add(new LogzioWinstonTransport(logzioOptions));
}

module.exports = logger;
