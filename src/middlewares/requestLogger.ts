import morgan from 'morgan';

import logger from '../appLogger';

/**
 * Middleware logging every API calls
 */
const requestLogger = morgan('tiny', {
  stream: {
    write(msg: string) {
      logger.http(msg.trimEnd());
    },
  },
});

export default requestLogger;
