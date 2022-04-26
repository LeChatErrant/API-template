import { Role } from '@prisma/client';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '@root/app.errors';
import combineMiddlewares from '@utils/combineMiddlewares';

import authMiddleware from './auth.middleware';

/**
 * Protect the route so only users with role ADMIN can access it
 *
 * @throws 401 - Unauthorized | If the user is not logged in
 * @throws 403 - Forbidden | If the user making the request is not ADMIN
 */
const adminMiddleware: RequestHandler = (req, res, next) => {
  if (req.session.user!.role === Role.ADMIN) {
    next();
  } else {
    next(new ApiError(StatusCodes.FORBIDDEN, 'You must be admin to perform this operation'));
  }
};

export default combineMiddlewares(authMiddleware, adminMiddleware);
