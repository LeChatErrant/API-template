import winston from 'winston';

import { beautifyJson } from '@utils/json';

const customFormat = winston.format.printf((args) => {
  const { timestamp, level, message } = args;
  if (!message || message === '') {
    return '';
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const more: Array<any> | undefined = args[Symbol.for('splat') as unknown as string];
  const moreMsg = more
    ? more.map((msg) => (msg instanceof Object ? beautifyJson(msg) : msg.toString()))
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
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

export default logger;
