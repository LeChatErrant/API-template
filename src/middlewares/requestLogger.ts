import morgan from 'morgan';

import logger from '../appLogger';

const requestLogger = morgan('tiny', {
  stream: {
    write(msg: string) {
      logger.http(msg.trimEnd());
    },
  },
});

export default requestLogger;
