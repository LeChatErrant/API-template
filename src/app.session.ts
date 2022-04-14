import { Role } from '@prisma/client';
import session from 'express-session';

import { config, MODES } from '@root/app.config';
import store from '@services/store';

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
