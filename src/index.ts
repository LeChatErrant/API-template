import app from './app';
import { config } from './appConfig';
import logger from './appLogger';
import waitApp from './utils/waitApp';

const { port } = config;

// eslint-disable-next-line no-console
process.on('uncaughtException', (e) => console.error(e));
// eslint-disable-next-line no-console
process.on('unhandledRejection', (e) => console.error(e));

(async function main() {
  await waitApp();
  app.listen(port, () => logger.info(`Server listening on port ${port}...`));
}());
