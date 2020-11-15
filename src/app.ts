import express from 'express';
import session from 'express-session';
import createError from 'http-errors';
import httpStatus from 'http-status-codes';
import redis from 'redis';
import connectRedis from 'connect-redis';

/*  This import is only used for class-transformer side effects */
import 'reflect-metadata';

import { config, MODES, redisConfig } from './appConfig';
import logger from './appLogger';
import router from './components';
import requestLogger from './middlewares/requestLogger';
import errorMiddleware from './middlewares/errorMiddleware';

/*  Express server  */
const app = express();
const { port } = config;

/*  Middlewares */
app.use(requestLogger);
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
  cookie: { httpOnly: true, secure: config.mode === MODES.PROD },
  resave: false,
  saveUninitialized: false,
  store,
}));

/*  Routes  */
app.use(router);

/*  404 middleware  */
app.use((req, res, next) => next(createError(httpStatus.NOT_FOUND, `${req.url} not found`)));

/*  Error middleware  */
app.use(errorMiddleware);

/*  Server error handlers */
process.on('uncaughtException', (e) => logger.error(e));
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
process.on('unhandledRejection', (e: any) => logger.error(e ? e.stack : e));

app.listen(port, () => logger.info(`Server listening on port ${port}...`));
