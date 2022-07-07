import { magenta } from 'colors';
import winston from 'winston';

import { beautifyJson } from '@utils/json';

/**
 * Custom logging format, allowing to pass multiple arguments and correctly handling any datatype
 */
const customFormat = winston.format.printf((args) => {
  const { timestamp, level, message, scope } = args;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const more: Array<any> | undefined = args[Symbol.for('splat') as unknown as string];
  const moreMsg = more
    ? more.map((msg) => (msg instanceof Object ? beautifyJson(msg) : msg.toString()))
    : [];
  return `${timestamp}${scope ? ` [${magenta(scope)}]` : ''} | ${level}: ${message} ${moreMsg.join(' ')}`;
});

/**
 * Logger instance
 */
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

/**
 * Create a child logger, prefixing all logs with a scope indicator
 * Useful to segment logs
 *
 * @param scope Prefix for all logs
 */
export function createChildLogger(scope: string) {
  const child = logger.child({ scope });
  child.debug('Logger created');
  return child;
}

export default createChildLogger('app');
