import morgan from 'morgan';
import logger from '../appLogger';

export default morgan('tiny', {
  stream: {
    write(msg: string) {
      logger.http(msg.trimEnd());
    },
  },
});
