import winston from 'winston';

import { config, MODES } from './appConfig';

const customFormat = winston.format.printf(({
  level, message, timestamp,
}) => `${timestamp} | ${level}: ${message}`);

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    customFormat,
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `all.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (config.mode !== MODES.PROD) {
  logger.add(new winston.transports.Console());
}

export default logger;
