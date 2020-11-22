import session from 'express-session';
import { Role } from '@prisma/client';

import { config, MODES } from './appConfig';
import store from './appStore';

interface UserSession {
  id: string;
  role: Role;
}

declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

export default session({
  secret: config.sessionSecret,
  cookie: { httpOnly: true, secure: config.mode === MODES.PROD },
  resave: false,
  saveUninitialized: false,
  store,
});
