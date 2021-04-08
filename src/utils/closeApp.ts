import db from '../appDatabase';
import { redisClient } from '../appStore';
import logger from '../appLogger';

export default async function closeApp() {
  /*  Prisma  */
  logger.info('Disconnecting from database...');
  await db
    .$disconnect()
    .then(() => {
      logger.info('Disconnected from database !');
    })
    .catch((error) => {
      logger.error(error);
      throw error;
    });

  /*  Redis */
  if (redisClient) {
    logger.info('Disconnecting from redis...');
    await new Promise<void>((resolve, reject) => {
      redisClient!.quit((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    logger.info('Disconnected from redis !');
  }
}
