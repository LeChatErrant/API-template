import type { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Role } from '@prisma/client';

import authMiddleware from './authMiddleware';
import combineMiddlewares from '../utils/combineMiddlewares';

/**
 * This middleware scopes an entity to a specific user
 * It ensures nobody except the user owning the resource can access it, unless admin
 *
 * In summary, it does 2 things :
 *  - It checks if the user is logged in
 *  - It checks if the user has the right to access the requested resources
 *     - If the user has the role USER, he can only access his own resources
 *     - If the user has the role ADMIN, he can access resources from every user
 *
 * @throws 400 - Bad request | If the route parameters are missing
 * @throws 401 - Unauthorized | If not logged in
 * @throws 403 - Forbidden | If the user making the request is not allowed to
 * access the targeted user
 *
 * @example
 * router.get('/users/:userId', ownershipMiddleware, ...);
 * // You can't access this route without being logged in anymore
 * // If a user A try to call this route with the id of the user B, it'll be rejected
 * // (unless user A is an ADMIN)
 */
const ownershipMiddleware: RequestHandler = (req, res, next) => {
  if (!req.params.userId) {
    next(createError(httpStatus.BAD_REQUEST, 'A route parameter named "userId" have to be defined'));
  } else if (req.params.userId !== req.session.user!.id && req.session.user!.role !== Role.ADMIN) {
    next(createError(httpStatus.FORBIDDEN, 'You are not allowed to access other users information\'s'));
  } else {
    next();
  }
};

export default combineMiddlewares(authMiddleware, ownershipMiddleware);
