import type { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';

import { ApiError } from '../appErrors';

/**
 * Protect the route so only logged users can access it.
 * Often combined with other middlewares, to
 * first make sure that userSession is defined before any check
 *
 * @throws 401 - Unauthorized | If the user is not logged in
 */
const authMiddleware: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in'));
  }
};

export default authMiddleware;
