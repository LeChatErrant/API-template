import db from '../appDatabase';
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
    });
}
