import morgan from 'morgan';

import logger from '@services/logger';

/**
 * Middleware logging every API calls
 */
const requestLoggerMiddleware = morgan('tiny', {
  stream: {
    write(msg: string) {
      logger.http(msg.trimEnd());
    },
  },
});

export default requestLoggerMiddleware;
