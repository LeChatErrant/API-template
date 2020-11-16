import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Role } from '@prisma/client';

import authMiddleware from './authMiddleware';

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
    next(createError(httpStatus.FORBIDDEN, 'You must be admin to perform this operation'));
  }
};

export default [authMiddleware, adminMiddleware];
