import { PrismaClient } from '@prisma/client';

import logger from './appLogger';
import { config } from './appConfig';

const client = new PrismaClient();

client
  .connect()
  .then(() => {
    logger.info(`Connected to database at url ${config.db_url}`);
  })
  .catch(() => {
    logger.info(`Can't connect to database as url ${config.db_url}`);
  });

export default client;
