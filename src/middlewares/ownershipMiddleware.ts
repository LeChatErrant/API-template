import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Role } from '@prisma/client';

import authMiddleware from './authMiddleware';

/**
 * This middleware prevent resources owned by an user to be
 * accessed by anyone other than this specific user and users with role ADMIN
 *
 * Additionally, it allows to add the 'me' logic on routes
 * (enabling to use `me` as userId to refer to your own user)

 * In summary, it does 3 things :
 *  - It checks if the user is logged in
 *  - It checks if the user has the right to access the requested resources
 *     - If the user has the role USER, he can only access his own resources
 *     - If the user has the role ADMIN, he can access resources from every users
 *  - It enables using 'me' as userId, to refer to the user currently logged (ex: GET /users/me)
 *
 * @throws 400 - Bad request | If the route parameters are missing
 * @throws 401 - Unauthorized | If not logged in
 * @throws 401 - Unauthorized | If the user making the request is not allowed to
 * access the targeted user
 *
 * @example
 * router.get('/users/:userId', ownershipMiddleware, ...);
 * // You can't access this route without being logged in anymore
 * // If an user A try to call this route with the id of the user B, it'll be rejected
 * // (unless user A is an ADMIN)
 * // And now, you can GET /users/me
 */
const ownershipMiddleware: RequestHandler = (req, res, next) => {
  if (!req.params.userId) {
    next(createError(httpStatus.BAD_REQUEST, 'A route parameter named "userId" have to be defined'));
  } else if (
    req.params.userId !== 'me'
    && req.params.userId !== req.session.user!.id
    && req.session.user!.role !== Role.ADMIN
  ) {
    next(createError(httpStatus.FORBIDDEN, 'You are not allowed to access other users information\'s'));
  } else {
    if (req.params.userId === 'me') req.params.userId = req.session.user!.id;
    next();
  }
};

export default [authMiddleware, ownershipMiddleware];
