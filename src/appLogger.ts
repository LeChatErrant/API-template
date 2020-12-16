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
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

if (config.mode !== MODES.PROD) {
  logger.add(new winston.transports.Console());
}

export default logger;
