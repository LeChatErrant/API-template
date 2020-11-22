import db from '../appDatabase';
import store from '../appStore';
import logger from '../appLogger';
import { config } from '../appConfig';

export default async function waitApp() {
  /*  Prisma  */
  logger.info('Waiting database...');
  await db
    .$connect()
    .then(() => {
      logger.info(`Connected to database at url ${config.dbUrl}`);
    })
    .catch((error) => {
      logger.error(error);
      logger.error(`Can't connect to database at url ${config.dbUrl}`);
      throw error;
    });

  /*  Redis */
  if (store.redisClient) {
    logger.info('Waiting redis...');
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        const isConnected = store.redisClient?.ping();
        if (isConnected) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
    logger.info('Redis connected !');
  }
}
