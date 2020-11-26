import app from './app';
import { config } from './appConfig';
import logger from './appLogger';
import waitApp from './utils/waitApp';
import seedAdminUser from './utils/seedAdminUser';

const { port } = config;

(async function main() {
  await waitApp();
  await seedAdminUser();
  app.listen(port, () => logger.info(`Server listening on port ${port} on mode ${config.mode}...`));
}());
