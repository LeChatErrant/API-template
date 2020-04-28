import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import session from 'express-session';
import createError from 'http-errors';
import httpStatus from 'http-status-codes';
import redis from 'redis';
import connectRedis from 'connect-redis';

import { config, redisConfig } from './appConfig';
import logger from './appLogger';
import router from './components';

/*  Express server  */
const app = express();
const { port } = config;

/*  Middlewares */
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*  Proxy rules */
app.set('trust proxy', true);

/*  Redis */
let store;
if (redisConfig.enabled) {
  const redisClient = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
  });
  redisClient.on('error', (err) => logger.error(err));

  const RedisStore = connectRedis(session);
  store = new RedisStore({ client: redisClient });
  logger.info('Connecting to Redis...');
}

/*  Express session */
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store,
}));

/*  Routes  */
app.use(router);

/*  404 middleware  */
app.use((req, res, next) => {
  next(createError(httpStatus.NOT_FOUND, `${req.url} not found`));
});

/*  Error middleware  */
app.use(((err, req, res, _) => {
  logger.error(err.message);
  if (!err.status) {
    logger.error(err);
  }
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
}) as ErrorRequestHandler);

/*  Server error handlers */
process.on('uncaughtException', (e) => logger.error(e));
process.on('unhandledRejection', (e: any) => logger.error(e ? e.stack : e));

app.listen(port, () => logger.info(`Server listening on port ${port}...`));
