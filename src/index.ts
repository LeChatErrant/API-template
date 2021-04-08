import app from './app';
import db from './appDatabase';
import logger from './appLogger';
import { config } from './appConfig';
import waitApp from './utils/waitApp';
import seedAdminUser from './utils/seedAdminUser';

const { port } = config;

async function main() {
  await waitApp();
  await seedAdminUser();
  app.listen(port, () => logger.info(`Server listening on port ${port} on mode ${config.mode}...`));
}

main()
  .catch((error) => {
    logger.error(error);
    throw error;
  })
  .finally(async () => {
    await db.$disconnect();
  });
