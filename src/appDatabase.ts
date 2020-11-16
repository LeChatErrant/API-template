import { PrismaClient } from '@prisma/client';
import logger from './appLogger';

const client = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

client.$on('info', (e) => logger.info(e.message));
client.$on('warn', (e) => logger.warn(e.message));

export default client;
