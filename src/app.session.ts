import { Role } from '@prisma/client';
import connectRedis from 'connect-redis';
import session from 'express-session';

import { config } from '@root/app.config';
import redis from '@services/redis';

/**
 * Typing for the user session, containing information about the logged-in user
 */
interface UserSession {
  id: string;
  role: Role;
}

/**
 * Extend the default express session typings
 */
declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

const RedisStore = connectRedis(session);

export default session({
  secret: config.sessionSecret,
  cookie: { httpOnly: true, secure: config.secureCookies },
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redis }),
});
