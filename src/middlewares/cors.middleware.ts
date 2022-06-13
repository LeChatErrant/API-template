import cors from 'cors';
import { StatusCodes } from 'http-status-codes';

import { config } from '@root/app.config';
import { ApiError } from '@root/app.errors';

/**
 * Cors middleware checking request origin
 * Whitelisted URLs can be configured through environment variables
 */
const corsMiddleware = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (origin === undefined) {
      callback(null, true);
    } else if (config.whitelist.indexOf(origin!) !== -1) {
      callback(null, true);
    } else {
      callback(new ApiError(StatusCodes.BAD_REQUEST, `Request's origin (${origin}) not allowed by CORS policy.`));
    }
  },
});

export default corsMiddleware;
