import { PrismaClient } from '@prisma/client';
import logger from './appLogger';

const db = new PrismaClient({
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

db.$on('info', (e) => logger.info(e.message));
db.$on('warn', (e) => logger.warn(e.message));

export default db;
