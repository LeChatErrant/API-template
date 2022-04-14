import app from './app';
import { config } from './app.config';
import logger from './services/logger';
import seedAdminUser from './utils/seedAdminUser';
import waitApp from './utils/waitApp';

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
  });
