import winston from 'winston';

import { config, MODES } from './appConfig';

const customFormat = winston.format.printf((args) => {
  const { timestamp, level, message } = args;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const more: Array<any> | undefined = args[Symbol.for('splat') as unknown as string];
  const moreMsg = more
    ? more.map((msg) => (msg instanceof Object ? JSON.stringify(msg, null, 2) : msg.toString()))
    : [];
  return `${timestamp} | ${level}: ${message} ${moreMsg.join(' ')}`;
});

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
