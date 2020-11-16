import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Role } from '@prisma/client';

import authMiddleware from './authMiddleware';

/**
 * This middleware prevent resources to be accessed by anyone other than
 * the user logged in or an ADMIN
 * Additionally, it allows to add the 'me' logic on routes
 * (enabling to use `me` as userId to refer to your own user)
 *
 * @throws 400 - Bad request | If the route parameter `userId` was not defined
 * @throws 401 - Unauthorized | If not logged in
 * @throws 401 - Unauthorized | If the user making the request
 * is not allowed to access the targeted user
 *
 * The 'me' logic:
 * Simply defines a route parameter named `userId` in the route
 * The middleware will replace it by the id of the currently logged user if the value `me` is passed
 * Of course, authentication is first checked
 *
 * @example
 * router.get('/users/:userId', userMiddleware, ...);
 * // You can't access this route without being logged in anymore
 * // If an user A try to call this route with the id of the user B, it'll be rejected
 * // (unless user A is an ADMIN)
 * // And now, you can GET /users/me
 */
const userMiddleware: RequestHandler = (req, res, next) => {
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

export default [authMiddleware, userMiddleware];
